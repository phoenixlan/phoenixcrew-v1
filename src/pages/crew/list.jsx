import React , { useEffect, useState } from "react";
import { Crew } from "@phoenixlan/phoenix.js";
import { PageLoading } from "../../components/pageLoading"
import { faArrowRight, faCheck, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InputCheckbox } from "../../components/dashboard";
import { Table, TableCell, CrewColorBox, IconContainer, SelectableTableRow, TableHead, TableRow } from "../../components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";


export const CrewList= () => {
    const [crews, setCrews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleUUID, setVisibleUUID] = useState(false);

    let history = useHistory();

    useEffect(async () => {
        const crews = await Promise.all((await Crew.getCrews()).map(async (crew) => {
            return await Crew.getCrew(crew.uuid);
        }))
        setCrews(crews);
        setLoading(false);
    }, []);

    if(loading) {
        return (
            <PageLoading />
        )
    }

    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Crew
                </DashboardTitle>
                <DashboardSubtitle>
                    {crews.length} crew registrert
                </DashboardSubtitle>
            </DashboardHeader>
            <DashboardContent>
                <InnerContainer mobileHide>
                    <InputCheckbox label="Vis crew UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                </InnerContainer>

                <InnerContainer>
                    <Table>
                        <TableHead border>
                            <TableRow>
                                <TableCell as="th" flex="10" mobileHide visible={!visibleUUID}>UUID</TableCell>
                                <TableCell as="th" flex="0 42px" mobileHide>Farge</TableCell>
                                <TableCell as="th" flex="6" mobileFlex="3">Navn</TableCell>
                                <TableCell as="th" flex="10" mobileHide>Beskrivelse</TableCell>
                                <TableCell as="th" flex="3" mobileFlex="1">Antall<br/>brukere</TableCell>
                                <TableCell as="th" center flex="0 24px" mobileHide title="Statusikon: Ikon vises om crewet kan søkes til eller ikke"><IconContainer>...</IconContainer></TableCell>
                                <TableCell as="th" center flex="0 24px" mobileHide title="Statusikon: Ikon vises om crewet er aktivt eller ikke."><IconContainer>...</IconContainer></TableCell>
                                <TableCell as="th" center flex="0 24px" mobileHide title="Trykk for å åpne"><IconContainer>...</IconContainer></TableCell>
                            </TableRow>
                        </TableHead>
                    
                        {
                            crews.map((crew) => {
                                const crewMembersMap = new Map();
                                crew.positions.forEach((position) => {
                                    position.position_mappings.map(mapping => mapping.user).forEach((user) => {
                                        if(!crewMembersMap.has(user.uuid)) {
                                            crewMembersMap.set(user.uuid, user)
                                        }
                                    })
                                })

                                const crewMembers = Array.from(crewMembersMap.values());

                                return (
                                    <SelectableTableRow onClick={e => {history.push(`/crew/${crew.uuid}`)}} active={!crew.active}>
                                        <TableCell consolas flex="10" mobileHide visible={!visibleUUID}>{ crew.uuid }</TableCell>
                                        <TableCell flex="0 42px" mobileHide><CrewColorBox hex={crew.hex_color} /></TableCell>
                                        <TableCell flex="6" mobileFlex="3">{ crew.name }</TableCell>
                                        <TableCell flex="10" mobileHide>{ crew.description }</TableCell>
                                        <TableCell flex="3" mobileFlex="1">{ crewMembers.length }</TableCell>
                                        <TableCell center flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={crew.is_applyable ? faUserPlus : ""} /></IconContainer></TableCell>
                                        <TableCell center flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={crew.active ? faCheck : ""}/></IconContainer></TableCell>
                                        <TableCell center flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
                                    </SelectableTableRow>
                                )
                            })
                        } 
                    </Table>
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
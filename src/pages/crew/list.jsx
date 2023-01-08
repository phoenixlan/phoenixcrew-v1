import React , { useEffect, useState } from "react";
import { Crew } from "@phoenixlan/phoenix.js";
import { PageLoading } from "../../components/pageLoading"
import { faArrowRight, faCheck, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InputCheckbox } from "../../components/dashboard";
import { Table, Column, CrewColorBox, IconContainer, SelectableRow, TableHeader } from "../../components/table";
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
                <InnerContainer mqhide>
                    <InputCheckbox label="Vis crew UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                </InnerContainer>

                <InnerContainer>
                    <Table>
                        <TableHeader border>
                            <Column flex="10" mqhide visible={!visibleUUID}>UUID</Column>
                            <Column flex="0 42px" mqhide>Farge</Column>
                            <Column flex="6" mqflex="3">Navn</Column>
                            <Column flex="10" mqhide>Beskrivelse</Column>
                            <Column flex="3" mqflex="1">Antall<br/>brukere</Column>
                            <Column center flex="0 24px" mqhide title="Statusikon: Ikon vises om crewet kan søkes til eller ikke"><IconContainer>...</IconContainer></Column>
                            <Column center flex="0 24px" mqhide title="Statusikon: Ikon vises om crewet er aktivt eller ikke."><IconContainer>...</IconContainer></Column>
                            <Column center flex="0 24px" mqhide title="Trykk for å åpne"><IconContainer>...</IconContainer></Column>
                        </TableHeader>
                    
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
                                    <SelectableRow onClick={e => {history.push(`/crew/${crew.uuid}`)}} active={!crew.active}>
                                        <Column consolas flex="10" mqhide visible={!visibleUUID}>{ crew.uuid }</Column>
                                        <Column flex="0 42px" mqhide><CrewColorBox hex={crew.hex_color} /></Column>
                                        <Column flex="6" mqflex="3">{ crew.name }</Column>
                                        <Column flex="10" mqhide>{ crew.description }</Column>
                                        <Column flex="3" mqflex="1">{ crewMembers.length }</Column>
                                        <Column center flex="0 24px" mqhide><IconContainer><FontAwesomeIcon icon={crew.is_applyable ? faUserPlus : ""} /></IconContainer></Column>
                                        <Column center flex="0 24px" mqhide><IconContainer><FontAwesomeIcon icon={crew.active ? faCheck : ""}/></IconContainer></Column>
                                        <Column center flex="0 24px" mqhide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                                    </SelectableRow>
                                )
                            })
                        } 
                    </Table>
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
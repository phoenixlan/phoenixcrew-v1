
import React , { useEffect, useState } from "react";
import styled from "styled-components";

import { Position, Crew } from "@phoenixlan/phoenix.js";

import { TableCell, IconContainer, InnerColumnCenter, SelectableTableRow, Table, TableHead, TableRow, TableBody } from '../../components/table';
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, IFrameContainer, InnerTableCell, InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputDate, InputElement, InputLabel, InputText } from '../../components/dashboard';
import { PageLoading } from "../../components/pageLoading"

import { Theme } from "../../theme";
import { SimpleUserCard } from "../../components/simpleUserCard";
import { faArrowRight, faPercent } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory, useParams } from "react-router-dom";


export const ViewPosition = (props) => {

    const { uuid } = useParams();
    const [error, setError] = useState(false);
    const [position, setPosition] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleUUID, setVisibleUUID] = useState(false);
    const [activeContent, setActiveContent] = useState(1);

    let history = useHistory();

    const build = async () => {
        setLoading(true);

        // Get position based on UUID and return error if something fails.
        try {
            const position = await Position.getPosition(uuid);
            setPosition(position);
            setLoading(false);
        } catch(e) {
            setError(e);
        }
    }

    useEffect(() => {
        build().catch(e => { 
            console.log(e);
        })
    }, []);

    return (
        <>
            <DashboardHeader>
                <DashboardTitle>
                    Stilling
                </DashboardTitle>
                <DashboardSubtitle>
                    {position.name}
                </DashboardSubtitle>
            </DashboardHeader>
            {
                error ? 
                    <>
                        Det oppsto en feil ved henting av informasjon for denne stillingen.
                    </>
                : loading ? "vent... " :
                    <>
                        <DashboardBarSelector border>
                            <DashboardBarElement active={activeContent == 1} onClick={() => setActiveContent(1)}>Generelt</DashboardBarElement>
                            <DashboardBarElement active={activeContent == 2} onClick={() => setActiveContent(2)}>Rettigheter ({position.permissions.length})</DashboardBarElement>
                            <DashboardBarElement active={activeContent == 3} onClick={() => setActiveContent(3)}>Medlemmer ({position.position_mappings.length})</DashboardBarElement>
                        </DashboardBarSelector>

                        <DashboardContent visible={activeContent == 1}>
                            <InnerContainer>
                                
                            </InnerContainer>
                        </DashboardContent>

                        <DashboardContent visible={activeContent == 2}>
                            <InnerContainer mobileHide>
                                <InputCheckbox label="Vis UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                            </InnerContainer>
                            <Table>
                                <TableHead border>
                                    <TableRow>
                                        <TableCell as="th" flex="5" mobileHide visible={!visibleUUID}>UUID</TableCell>
                                        <TableCell as="th" flex="6">Rettighet</TableCell>
                                        <TableCell as="th" flex="0 24px" mobileHide />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        position.permissions.map((permission) => {
                                            return (
                                                <SelectableTableRow>
                                                    <TableCell consolas flex="5" visible={!visibleUUID}>{ permission.uuid }</TableCell>
                                                    <TableCell flex="6" uppercase>{ permission.permission }</TableCell>
                                                    <TableCell flex="0 24px" mobileHide><IconContainer></IconContainer></TableCell>
                                                </SelectableTableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </DashboardContent>

                        <DashboardContent visible={activeContent == 3}>
                            <InnerContainer mobileHide>
                                <InputCheckbox label="Vis UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                            </InnerContainer>
                            <Table>
                                <TableHead border>
                                    <TableRow>
                                        <TableCell as="th" flex="5" mobileHide visible={!visibleUUID}>UUID</TableCell>
                                        <TableCell as="th" flex="3" mobileFlex="3">Navn</TableCell>
                                        <TableCell as="th" flex="3" mobileFlex="2">Brukernavn</TableCell>
                                        <TableCell as="th" flex="0 24px" mobileHide />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        position.position_mappings.map((position_mapping) => {
                                            const user = position_mapping.user
                                            return (
                                                <SelectableTableRow onClick={e => {history.push(`/user/${user.uuid}`)}} title="Trykk for å åpne">
                                                    <TableCell consolas flex="5" visible={!visibleUUID}>{ user.uuid }</TableCell>
                                                    <TableCell flex="3" mobileFlex="3">{ user.lastname + ", " + user.firstname }</TableCell>
                                                    <TableCell flex="3" mobileFlex="2">{ user.username }</TableCell>
                                                    <TableCell flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
                                                </SelectableTableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </DashboardContent>
                </>
            }
        </>
    )
}
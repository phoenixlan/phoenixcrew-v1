
import React , { useEffect, useState } from "react";
import styled from "styled-components";

import { Position, Crew } from "@phoenixlan/phoenix.js";

import { Column, IconContainer, InnerColumnCenter, SelectableRow, Table, TableHeader } from '../../components/table';
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, IFrameContainer, InnerColumn, InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputDate, InputElement, InputLabel, InputText } from '../../components/dashboard';
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
                            <InnerContainer mqhide>
                                <InputCheckbox label="Vis UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                            </InnerContainer>
                            <Table>
                                <TableHeader border>
                                    <Column flex="5" mqhide visible={!visibleUUID}>UUID</Column>
                                    <Column flex="6">Rettighet</Column>
                                    <Column flex="0 24px" mqhide />
                                </TableHeader>
                            </Table>

                            {
                            position.permissions.map((permission) => {
                                return (
                                    <SelectableRow>
                                        <Column consolas flex="5" visible={!visibleUUID}>{ permission.uuid }</Column>
                                        <Column flex="6" uppercase>{ permission.permission }</Column>
                                        <Column flex="0 24px" mqhide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                                    </SelectableRow>
                                )
                            })}
                        </DashboardContent>

                        <DashboardContent visible={activeContent == 3}>
                            <InnerContainer mqhide>
                                <InputCheckbox label="Vis UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                            </InnerContainer>
                            <Table>
                                <TableHeader border>
                                    <Column flex="5" mqhide visible={!visibleUUID}>UUID</Column>
                                    <Column flex="3" mqflex="3">Navn</Column>
                                    <Column flex="3" mqflex="2">Brukernavn</Column>
                                    <Column flex="0 24px" mqhide />
                                </TableHeader>
                            </Table>

                            {
                                position.position_mappings.map((position_mapping) => {
                                    const user = position_mapping.user
                                    return (
                                        <SelectableRow onClick={e => {history.push(`/user/${user.uuid}`)}} title="Trykk for å åpne">
                                            <Column consolas flex="5" visible={!visibleUUID}>{ user.uuid }</Column>
                                            <Column flex="3" mqflex="3">{ user.lastname + ", " + user.firstname }</Column>
                                            <Column flex="3" mqflex="2">{ user.username }</Column>
                                            <Column flex="0 24px" mqhide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                                        </SelectableRow>
                                    )
                                })
                            }
                        </DashboardContent>
                </>
            }
        </>
    )
}

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

    const [positionName, setPositionName] = useState();
    const [positionMembers, setPositionMembers] = useState();
    const [positionPermissions, setPositionPermissions] = useState();

    let history = useHistory();

    const build = async () => {
        setLoading(true);

        // Get position based on UUID and return error if something fails.
        try {
            const position = await Position.getPosition(uuid);
            console.log(position);
            setPosition(position);
            setPositionMembers(position.users);
            setPositionPermissions(position.permissions);
            setLoading(false);
            setPositionName(position.name);
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
                    {positionName}
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
                            <DashboardBarElement active={activeContent == 2} onClick={() => setActiveContent(2)}>Rettigheter ({positionPermissions.length})</DashboardBarElement>
                            <DashboardBarElement active={activeContent == 3} onClick={() => setActiveContent(3)}>Medlemmer ({positionMembers.length})</DashboardBarElement>
                        </DashboardBarSelector>

                        <DashboardContent visible={activeContent == 1}>
                            <InnerContainer>
                                
                            </InnerContainer>
                        </DashboardContent>

                        <DashboardContent visible={activeContent == 2}>
                            <InnerContainer>
                                <InputCheckbox label="Vis UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                            </InnerContainer>
                            <Table>
                                <TableHeader border>
                                    <Column flex="5" visible={!visibleUUID}>UUID</Column>
                                    <Column flex="6">Navn</Column>
                                    <Column flex="0 24px" />
                                </TableHeader>
                            </Table>

                            {
                            positionPermissions.map((permission) => {
                                return (
                                    <SelectableRow>
                                        <Column consolas flex="5" visible={!visibleUUID}>{ permission.uuid }</Column>
                                        <Column flex="6" uppercase>{ permission.permission }</Column>
                                        <Column flex="0 24px"><IconContainer><FontAwesomeIcon /></IconContainer></Column>
                                    </SelectableRow>
                                )
                            })}
                        </DashboardContent>

                        <DashboardContent visible={activeContent == 3}>
                            <InnerContainer>
                                <InputCheckbox label="Vis UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                            </InnerContainer>
                            <Table>
                                <TableHeader border>
                                    <Column flex="5" visible={!visibleUUID}>UUID</Column>
                                    <Column flex="3">Navn</Column>
                                    <Column flex="3">Brukernavn</Column>
                                    <Column flex="0 24px" />
                                </TableHeader>
                            </Table>

                            {
                            positionMembers.map((user) => {
                                return (
                                    <SelectableRow onClick={e => {history.push(`/user/${user.uuid}`)}} title="Trykk for å åpne">
                                        <Column consolas flex="5" visible={!visibleUUID}>{ user.uuid }</Column>
                                        <Column flex="3">{ user.lastname + ", " + user.firstname }</Column>
                                        <Column flex="3">{ user.username }</Column>
                                        <Column flex="0 24px"><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                                    </SelectableRow>
                                )
                            })}
                        </DashboardContent>
                </>
            }
        </>
    )
}
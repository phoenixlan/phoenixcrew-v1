import React , { useEffect, useRef, useState } from "react";

import { Position, Crew, getCurrentEvent } from "@phoenixlan/phoenix.js";

import { Column, IconContainer, SelectableRow, Table, TableHeader } from '../../components/table';
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InputCheckbox } from '../../components/dashboard';
import { PageLoading } from "../../components/pageLoading"

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";

export const PositionList = () => {
    const [roles, setRoles] = useState([]);
    const [crews, setCrews] = useState([]);
    const [ currentEvent, setCurrentEvent ] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visibleUUID, setVisibleUUID] = useState(false);

    const history = useHistory();

    useEffect(async () => {
        const [ positions, crews, currentEvent ] = await Promise.all([
            Promise.all(
                (await Position.getPositions()).map(position => Position.getPosition(position.uuid))
            ),
            Promise.all(
                (await Crew.getCrews()).map(crew => Crew.getCrew(crew.uuid))
            ),
            getCurrentEvent()
        ])

        setCrews(crews);
        setRoles(positions);
        setCurrentEvent(currentEvent);

        setLoading(false);
    }, []);


    if(loading) {
        return (
            <PageLoading />
        )
    }
    else {
        return (
            <>
                <DashboardHeader border>
                    <DashboardTitle>
                        Stillinger og rettigheter
                    </DashboardTitle>
                    <DashboardSubtitle>
                        {roles.length} stillinger er aktive
                    </DashboardSubtitle>
                </DashboardHeader>
                <DashboardContent>
                    <InnerContainer>
                        Stillinger er hvordan brukere tilhører crew, og hvordan brukere får rettigheter på nettsidene til Phoenix.<br />
                        En bruker kan ha flere stillinger og trenger ikke å bety at man tilhører et crew.
                    </InnerContainer>
                    <InnerContainer mqhide>
                        <InputCheckbox label="Vis stilling UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                    </InnerContainer>
    
                    <InnerContainer>
                        <Table>
                            <TableHeader border>
                                <Column flex="9" mqhide visible={!visibleUUID}>UUID</Column>
                                <Column flex="4" mqhide>Tilknyttet <br/>crew</Column>
                                <Column flex="9" mqflex="3">Navn</Column>
                                <Column flex="2" mqhide>Type</Column>
                                <Column flex="2" mqflex="1">Aktive <br/>brukere</Column>
                                <Column flex="2" mqhide>Antall <br/>rettigheter</Column>
                                <Column flex="0 24px" mqhide />
                            </TableHeader>
                            {
                                roles
                                .map((role) => {
                                    const roleCrew = crews.find((crew) => crew.uuid == role.crew_uuid)
                                    const roleTeam = roleCrew?.teams.find((team) => team.uuid == role.team_uuid)
    
    
                                    let name = (role.chief ? "Gruppeleder for " : "Medlemmer av ") + (roleTeam ? ` ${roleTeam.name} i ` : " ") + (roleCrew?.name ?? "Ukjent crew");
                                    if(role.name) {
                                        name = `${role.name}${roleCrew ? " (" + name + ")":""}`
                                    }
    
                                    
                                    return (
                                        <SelectableRow title="Trykk for å åpne" onClick={e => {history.push(`/positions/${role.uuid}`)}} key={role.uuid}>
                                            <Column mqhide consolas flex="9" visible={!visibleUUID}>{role.uuid}</Column>
                                            <Column flex="4" mqhide>{(roleCrew?.name ?? "-")}</Column>
                                            <Column flex="9" mqflex="3">{name}</Column>
                                            <Column flex="2" mqhide>{role.name ? "Custom" : "System"}</Column>
                                            <Column flex="2" mqflex="1">{role.position_mappings.filter(mapping => !mapping.event_uuid || mapping.event_uuid === currentEvent.uuid).length}</Column>
                                            <Column flex="2" mqhide>{role.permissions.length}</Column>
                                            <Column flex="0 24px" mqhide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                                        </SelectableRow>
                                    )
                                })
                                .sort((a, b) => {
                                    const crewNameA = a.props.children[1].props.children;
                                    const crewNameB = b.props.children[1].props.children;
                                    
                                    if (crewNameA < crewNameB) {
                                        return -1;
                                    } else {
                                        return 1;
                                    }
                                })
                            }
                        </Table>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
import React , { useEffect, useState } from "react";

import { Position, Crew, getCurrentEvent } from "@phoenixlan/phoenix.js";

import { Column, IconContainer, SelectableRow, Table, TableHeader } from '../../components/table';
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InputCheckbox } from '../../components/dashboard';
import { PageLoading } from "../../components/pageLoading"

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";

export const PositionAdmin = () => {

    const [roles, setRoles] = useState([]);
    const [crews, setCrews] = useState([]);
    const [ currentEvent, setCurrentEvent ] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visibleUUID, setVisibleUUID] = useState(false);

    let history = useHistory();

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
                    <InnerContainer>
                        <InputCheckbox label="Vis stilling UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                    </InnerContainer>
    
                    <InnerContainer>
                        <Table>
                            <TableHeader border>
                                <Column flex="9" visible={!visibleUUID}>UUID</Column>
                                <Column flex="4">Tilknyttet <br/>crew</Column>
                                <Column flex="9">Navn</Column>
                                <Column flex="2">Type</Column>
                                <Column flex="2">Antall <br/>brukere</Column>
                                <Column flex="2">Antall <b>aktive</b><br/>brukere</Column>
                                <Column flex="2">Antall <br/>rettigheter</Column>
                                <Column flex="0 24px" />
                            </TableHeader>
                            {
                                roles.map((role) => {
                                    const roleCrew = crews.find((crew) => crew.uuid == role.crew_uuid)
                                    const roleTeam = roleCrew?.teams.find((team) => team.uuid == role.team_uuid)
    
    
                                    let name = (role.chief ? "Gruppeleder for " : "Medlemmer av ") + (roleTeam ? ` ${roleTeam.name} i ` : " ") + (roleCrew?.name ?? "Ukjent crew");
                                    if(role.name) {
                                        name = `${role.name}${roleCrew ? " (" + name + ")":""}`
                                    }
    
                                    return (
                                        <SelectableRow title="Trykk for å åpne" onClick={e => {history.push(`/positions/${role.uuid}`)}}>
                                            <Column consolas flex="9" visible={!visibleUUID}>{role.uuid}</Column>
                                            <Column flex="4">{(roleCrew?.name ?? "-")}</Column>
                                            <Column flex="9">{name}</Column>
                                            <Column flex="2">{role.name ? "Custom" : "System"}</Column>
                                            <Column flex="2">{role.position_mappings.length}</Column>
                                            <Column flex="2">{role.position_mappings.filter(mapping => !mapping.event_uuid || mapping.event_uuid === currentEvent.uuid).length}</Column>
                                            <Column flex="2">{role.permissions.length}</Column>
                                            <Column flex="0 24px"><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
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
}
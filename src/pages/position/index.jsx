import React , { useEffect, useRef, useState } from "react";

import { Position, Crew, getCurrentEvent } from "@phoenixlan/phoenix.js";

import { TableCell, IconContainer, SelectableTableRow, Table, TableBody, TableHead, TableRow } from '../../components/table';
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
                    <InnerContainer mobileHide>
                        <InputCheckbox label="Vis stilling UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                    </InnerContainer>
    
                    <InnerContainer>
                        <Table>
                            <TableHead border>
                                <TableRow>
                                    <TableCell as="th" flex="9" mobileHide visible={!visibleUUID}>UUID</TableCell>
                                    <TableCell as="th" flex="4" mobileHide>Tilknyttet <br/>crew</TableCell>
                                    <TableCell as="th" flex="9" mobileFlex="3">Navn</TableCell>
                                    <TableCell as="th" flex="2" mobileHide>Type</TableCell>
                                    <TableCell as="th" flex="2" mobileFlex="1">Aktive <br/>brukere</TableCell>
                                    <TableCell as="th" flex="2" mobileHide>Antall <br/>rettigheter</TableCell>
                                    <TableCell as="th" flex="0 24px" mobileHide />
                                </TableRow>
                            </TableHead>
                            <TableBody>            
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
                                            <SelectableTableRow title="Trykk for å åpne" onClick={e => {history.push(`/positions/${role.uuid}`)}} key={role.uuid}>
                                                <TableCell mobileHide consolas flex="9" visible={!visibleUUID}>{role.uuid}</TableCell>
                                                <TableCell flex="4" mobileHide>{(roleCrew?.name ?? "-")}</TableCell>
                                                <TableCell flex="9" mobileFlex="3">{name}</TableCell>
                                                <TableCell flex="2" mobileHide>{role.name ? "Custom" : "System"}</TableCell>
                                                <TableCell flex="2" mobileFlex="1">{role.position_mappings.filter(mapping => !mapping.event_uuid || mapping.event_uuid === currentEvent.uuid).length}</TableCell>
                                                <TableCell flex="2" mobileHide>{role.permissions.length}</TableCell>
                                                <TableCell flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
                                            </SelectableTableRow>
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
                            </TableBody>
                        </Table>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
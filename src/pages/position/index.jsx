import React , { useEffect, useRef, useState } from "react";

import { Position, Crew } from "@phoenixlan/phoenix.js";
import { useBrand } from "../../contexts/brand";

import { TableCell, IconContainer, SelectableTableRow, Table, TableBody, TableHead, TableRow } from '../../components/table';
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InputCheckbox, PanelButton, SpanLink } from '../../components/dashboard';
import { PageLoading } from "../../components/pageLoading"

import { faArrowRight, faAward, faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import { useBrandCrews } from "../../hooks/eventBrand/useBrandCrews";
import { useBrandPositions } from "../../hooks/eventBrand/useBrandPositions";

export const PositionList = () => {
    const { brand, currentEvent, path } = useBrand();
    const [visibleUUID, setVisibleUUID] = useState(false);

    const { data: positions, isLoading: isPositionsLoading} = useBrandPositions(brand.uuid);
    const { data: crews, isLoading: isCrewsLoading } = useBrandPositions(brand.uuid);

    const loading = isPositionsLoading || isCrewsLoading;

    const history = useHistory();

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
                        Stillinger og rettigheter for { brand.name }
                    </DashboardTitle>
                    <DashboardSubtitle>
                        {positions.length} stillinger
                    </DashboardSubtitle>
                </DashboardHeader>
                <DashboardContent>
                    <InnerContainer>
                        <InnerContainerRow mobileNoGap>
                            <PanelButton onClick={() => history.push(path("/position/create"))} disabled={false} icon={faPlus}>Opprett ny stilling</PanelButton>
                        </InnerContainerRow>
                    </InnerContainer>

                    <InnerContainer>
                        <InnerContainerRow>
                            Stillinger er hvordan brukere tilhører crew, og hvordan brukere får rettigheter på nettsidene til Phoenix.<br />
                            En bruker kan ha flere stillinger og trenger ikke å bety at man tilhører et crew.
                        </InnerContainerRow>
                    </InnerContainer>
    
                    <InnerContainer>
                        <Table>
                            <TableHead border>
                                <TableRow>
                                    <TableCell as="th" flex="9" mobileHide visible={!visibleUUID}>UUID <SpanLink onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? "(Skjul UUID)" : null}</SpanLink></TableCell>
                                    <TableCell as="th" flex="9" mobileFlex="3">Navn <SpanLink mobileHide onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? null : "(Vis UUID)"}</SpanLink></TableCell>
                                    <TableCell as="th" flex="4" mobileHide>Tilknyttet <br/>crew</TableCell>
                                    <TableCell as="th" flex="2" mobileFlex="1">Aktive <br/>brukere</TableCell>
                                    <TableCell as="th" flex="2" mobileHide>Antall <br/>rettigheter</TableCell>
                                    <TableCell as="th" flex="2" mobileHide>Symbolsk<br/>stilling</TableCell>
                                    <TableCell as="th" flex="0 24px" mobileHide />
                                </TableRow>
                            </TableHead>
                            <TableBody>            
                                {
                                    positions
                                    .map((position) => {
                                        const positionCrew = crews.find((crew) => crew.uuid == position.crew_uuid)
                                        const positionTeam = positionCrew?.teams.find((team) => team.uuid == position.team_uuid)
        
                                        let name = (position.chief ? "Gruppeleder for " : "Medlemmer av ") + (positionTeam ? ` ${positionTeam.name} i ` : " ") + (positionCrew?.name ?? "Ukjent crew");
                                        if(position.name) {
                                            name = `${position.name}${positionCrew ? " (" + name + ")":""}`
                                        }
                                        
                                        return (
                                            <SelectableTableRow title="Trykk for å åpne" onClick={() => history.push(path(`/positions/${position.uuid}`))} key={position.uuid}>
                                                <TableCell mobileHide consolas flex="9" visible={!visibleUUID}>{position.uuid}</TableCell>
                                                <TableCell flex="9" mobileFlex="3" italic={!position.name}>{name}</TableCell>
                                                <TableCell flex="4" mobileHide>{(positionCrew?.name ?? "-")}</TableCell>
                                                <TableCell flex="2" mobileFlex="1">{currentEvent ? position.position_mappings.filter(mapping => !mapping.event_uuid || mapping.event_uuid === currentEvent.uuid).length : 0}</TableCell>
                                                <TableCell flex="2" mobileHide>{position.permissions.length}</TableCell>
                                                <TableCell flex="2" mobileHide>{position.is_vanity ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null}</TableCell>
                                                <TableCell flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
                                            </SelectableTableRow>
                                        )
                                    })
                                    .sort((a, b) => {
                                        const crewNameA = a.props.children[2].props.children;
                                        const crewNameB = b.props.children[2].props.children;
                                        
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

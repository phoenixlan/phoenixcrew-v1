
import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faDownload }  from '@fortawesome/free-solid-svg-icons'
import { dateOfBirthToAge } from "../../utils/user";
import { Table, SelectableTableRow, Row, TableCell, TableHead, IconContainer, TableRow, TableBody } from "../../components/table";
import { PageLoading } from "../../components/pageLoading";
import { InnerContainerRow, InputContainer, InputLabel, InputSelect, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InputCheckbox, InnerContainerTitle, RowBorder, DropdownCardHeader, DropdownCardContent, DropdownCardContainer, PanelButton, CardContainer, SpanLink } from "../../components/dashboard";
import { FormButton } from '../../components/form';

import { useCurrentEvent } from "../../hooks/events/useCurrentEvent";
import { useEvents } from "../../hooks/events/useEvents";
import { useEventNewMembers } from "../../hooks/events/useEventNewMembers";

export const MembershipList = () => {
    const [ visibleUUID, setVisibleUUID ] = useState(false);

    let history = useHistory();

    const [ currentViewingEvent, setCurrentViewingEvent ] = useState(null);

    const updateViewingEvent = (event) => {
        console.log("Viewing event update")
        setCurrentViewingEvent(event.target.value)
    }

    const { data: currentEvent, isLoading: isLoadingCurrentEvent } = useCurrentEvent();
    const { data: events, isLoading: isLoadingEvents } = useEvents();
    const lookupEvent = (currentViewingEvent) ?? currentEvent?.uuid;
    const { data: users = [], isLoading: isLoadingUsers } = useEventNewMembers(lookupEvent);

    const loading = isLoadingCurrentEvent || isLoadingEvents || (lookupEvent && isLoadingUsers);

    useEffect(() => {
        if(!currentViewingEvent && currentEvent) {
            setCurrentViewingEvent(currentEvent.uuid);
        }
    }, [currentEvent, currentViewingEvent]);

    const downloadTextFile = (filename, text) => {
        console.log(text);

        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }


    const makeCsvFromUsers = (csvUsers) => {
        const csv = csvUsers.map(user => {
            const birthdate = new Date(user.birthdate).toLocaleString('no-NO', {year: 'numeric', month: '2-digit', day: '2-digit'})
            return `${user.firstname} ${user.lastname},${dateOfBirthToAge(user.birthdate)},${birthdate},${user.address},${user.postal_code}`
        }).join("\n")
        const header = "Navn,Alder,Fødselsdag,Addresse,Postnummer\n"
        downloadTextFile(`lan-medlemmer-${currentEvent.name.replace(" ", "-")}.csv`, header+csv);
    }

    const makeCsv = () => {
        makeCsvFromUsers(users)
    }

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
                        Medlemsskap
                    </DashboardTitle>
                    <DashboardSubtitle>
                        {users.length} medlemsskap fra dette arrangementet
                    </DashboardSubtitle>
                </DashboardHeader>
                <DashboardContent>
                    <InnerContainer>
                        <InnerContainerRow mobileNoGap>
                            <PanelButton onClick={() => makeCsv()} icon={faDownload}>Eksporter</PanelButton>
                        </InnerContainerRow>
                    </InnerContainer>

                    <InnerContainer>
                        <InnerContainerRow>
                            Systemet støtter oversikt over medlemsskap.<br/>
                            En bruker får medlemsskap og vises i listen under når det kjøpes en billett som gir medlemsskap.<br />
                            Informasjon om medlemmer kan hentes ut fra systemet ved å velge et arrangement, og trykke eksporter.<br />
                            Systemet vil opprette en .csv fil som inneholder informasjonen til alle medlemmene.
                        </InnerContainerRow>
                    </InnerContainer>

                    <InnerContainer>
                        <InnerContainerRow>
                            <InnerContainer flex="1">
                                <InputLabel small>Vis medlemsskap fra</InputLabel>
                                <InputSelect value={currentViewingEvent} onChange={updateViewingEvent}>
                                    {
                                        events.map((event) => (<option value={event.uuid}>{event.name} {currentEvent ? event.uuid == currentEvent.uuid ? "(Nåværende)" : null : null}</option>))
                                    }
                                </InputSelect>
                            </InnerContainer>
                            <InnerContainer flex="2" />
                        </InnerContainerRow>
                    </InnerContainer>

                    <InnerContainer>
                        <Table>
                            <TableHead border>
                                <TableRow>
                                    <TableCell as="th" flex="10" mobileHide visible={!visibleUUID}>UUID <SpanLink onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? "(Skjul UUID)" : null}</SpanLink></TableCell>
                                    <TableCell as="th" flex="6" mobileFlex="3">Navn <SpanLink mobileHide onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? null : "(Vis UUID)"}</SpanLink></TableCell>
                                    <TableCell as="th" flex="2" mobileFlex="1">Alder</TableCell>
                                    <TableCell as="th" flex="4" mobileHide>Fødselsdato</TableCell>
                                    <TableCell as="th" flex="4" mobileHide>Telefonnummer</TableCell>
                                    <TableCell as="th" flex="5" mobileHide>Addresse</TableCell>
                                    <TableCell as="th" flex="2" mobileHide>Postnr.</TableCell>
                                    <TableCell as="th" center flex="0 24px" mobileHide title="Trykk for å åpne"><IconContainer>...</IconContainer></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    users.map((user) => (
                                        <SelectableTableRow onClick={e => {history.push(`/user/${user.uuid}`)}}>
                                            <TableCell flex="10" mobileHide consolas visible={!visibleUUID}>{user.uuid}</TableCell>
                                            <TableCell flex="6" mobileFlex="3">{user.firstname} {user.lastname}</TableCell>
                                            <TableCell flex="2" mobileFlex="1">{dateOfBirthToAge(user.birthdate)}</TableCell>
                                            <TableCell flex="4" mobileHide>{ new Date(user.birthdate).toLocaleString('no-NO', {year: 'numeric', month: '2-digit', day: '2-digit'}) }</TableCell>
                                            <TableCell flex="4" mobileHide>{user.phone}</TableCell>
                                            <TableCell flex="5" mobileHide>{user.address}</TableCell>
                                            <TableCell flex="2" mobileHide>{user.postal_code}</TableCell>
                                            <TableCell center flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
                                        </SelectableTableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}

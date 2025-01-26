import React, { useState, useEffect } from "react";

import { TableCell, IconContainer, SelectableTableRow, Table, TableHead, TableBody, TableRow } from '../../../components/table';
import { DropdownCardContainer, DropdownCardContent, DropdownCardHeader, InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputLabel, InputSelect, PanelButton, RowBorder, SpanLink } from '../../../components/dashboard';
import { UserSearch } from "../../../components/userSearch";
import { FormButton } from '../../../components/form';

import { PositionMapping, getCurrentEvent, getEvents } from "@phoenixlan/phoenix.js";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import { PageLoading } from "../../../components/pageLoading";

const messages = {
    "position.addUserTitle": "Legg til bruker",
    "position.addUserDescription": ["Du kan bare gi ut stillingen for nåværende arrangement.", <br/>, "De vil ikke få en e-post for å informere om den nye stillingen.", <br/>, "Brukeren blir nødt til å logge ut og inn for at den nye stillingen skal tre i kraft."],
    "position.filterByEventTitle": "Vis medlemmer fra annet arrangement"
}


export const PositionMemberList = ({ position, refresh }) => {
    const [ loading, setLoading ] = useState(true);
    const [ visibleUUID, setVisibleUUID ] = useState(false);
    const [ member, setNewMember ] = useState(null);
    const [ isAddingMember, setIsAddingMember ] = useState(false);
    const [ addUserDropdownState, setAddUserDropdownState ] = useState(false);
    const [ filterEventDropdownState, setFilterEventDropdownState ] = useState(false);

    const [ currentEvent, setCurrentEvent ] = useState();
    const [ events, setEvents ] = useState();
    const [ currentViewingEvent, setCurrentViewingEvent ] = useState(null);

    const updateViewingEvent = (event) => {
        setCurrentViewingEvent(event.target.value)
    }

    const currentEventFilter = (position_mapping) => !position_mapping.event_uuid || position_mapping.event_uuid == currentViewingEvent;

    const history = useHistory();

    const addMember = async () => {
        if(!member) {
            alert("No member is selected");
        } else {
            setIsAddingMember(true);
            await PositionMapping.createPositionMapping(member, position.uuid);
            await refresh();
            setIsAddingMember(false);
        }
    }

    const load = async () => {
        setLoading(true)
        const [ currentEvent, events ] = await Promise.all([
            getCurrentEvent(),
            getEvents()
        ])
        setCurrentEvent(currentEvent);
        setCurrentViewingEvent(currentEvent.uuid);
        setEvents(events)
        setLoading(false);
    }

    useEffect(async () => {
        await load();
    }, [])

    if(loading) {  
        return (
            <PageLoading />
        )
    } else {
        const position_mappings = position.position_mappings.filter(currentEventFilter)
        return (
            <>
                <InnerContainer>
                    <DropdownCardContainer desktopHide>
                        <DropdownCardHeader title={messages["position.addUserTitle"]} dropdownState={addUserDropdownState} onClick={() => setAddUserDropdownState(!addUserDropdownState)} />
                        <DropdownCardContent dropdownState={addUserDropdownState}>
                            {messages["position.addUserDescription"]}
                            <UserSearch onUserSelected={setNewMember} onChange={() => setNewMember(null)}/>
                            {
                                isAddingMember ? (
                                    <PageLoading />
                                ) : (
                                    <PanelButton fillWidth disabled={!member} type="submit" onClick={() => addMember()}>Legg til</PanelButton>
                                )
                            }
                        </DropdownCardContent>
                    </DropdownCardContainer>
                    <DropdownCardContainer desktopHide>
                        <DropdownCardHeader title={messages["position.filterByEventTitle"]} dropdownState={filterEventDropdownState} onClick={() => setFilterEventDropdownState(!filterEventDropdownState)} />
                        <DropdownCardContent dropdownState={filterEventDropdownState}>
                            <InnerContainer flex="2" nopadding>
                            <InputLabel small>Arrangement</InputLabel>
                            <InputSelect value={currentViewingEvent} onChange={updateViewingEvent}>
                                {
                                    events.map((event) => (<option value={event.uuid}>{event.name} {event.uuid == currentEvent.uuid ? "(Nåværende)" : null}</option>))
                                }
                            </InputSelect>
                            </InnerContainer>
                        </DropdownCardContent>
                    </DropdownCardContainer>




                    <InnerContainerRow mobileHide>
                        <InnerContainerRow mobileHide>
                            <InnerContainer flex="4" nopadding>
                                <InnerContainerTitle>{messages["position.addUserTitle"]}</InnerContainerTitle>
                                {messages["position.addUserDescription"]}
                            </InnerContainer>
                            <RowBorder />
                            <InnerContainer flex="2" nopadding>
                                <UserSearch onUserSelected={setNewMember} onChange={() => setNewMember(null)}/>
                            </InnerContainer>
                            <InnerContainer flex="1" nopadding>
                                {
                                    isAddingMember ? (
                                        <PageLoading />
                                    ) : (
                                        <PanelButton fillWidth disabled={!member} type="submit" onClick={() => addMember()}>Legg til</PanelButton>
                                    )
                                }
                            </InnerContainer>
                        </InnerContainerRow>

                        <InnerContainerRow>
                            <InnerContainer flex="4" nopadding>
                            </InnerContainer>
                            <RowBorder />
                            <InnerContainer flex="2" nopadding>
                                <InputLabel small>Vis medlemmer fra annet arrangement</InputLabel>
                                <InputSelect value={currentViewingEvent} onChange={updateViewingEvent}>
                                    {
                                        events.map((event) => (<option value={event.uuid}>{event.name} {event.uuid == currentEvent.uuid ? "(Nåværende)" : null}</option>))
                                    }
                                </InputSelect>
                            </InnerContainer>
                            <InnerContainer flex="1" />
                        </InnerContainerRow>
                    </InnerContainerRow>
                </InnerContainer>

                <InnerContainer>
                    <InnerContainerRow>
                        <InnerContainerRow>
                            <InnerContainer>
                                <Table>
                                    <TableHead border>
                                        <TableRow>
                                            <TableCell mobileHide flex="3" visible={!visibleUUID}>UUID <SpanLink onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? "(Skjul UUID)" : null}</SpanLink></TableCell>
                                            <TableCell mobileFlex="2" flex="2">Brukernavn <SpanLink mobileHide onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? null : "(Vis UUID)"}</SpanLink></TableCell>
                                            <TableCell mobileFlex="3" flex="4">Navn</TableCell>
                                            <TableCell mobileHide flex="0 24px" />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            position_mappings.map((position_mapping) => {
                                                const user = position_mapping.user
                                                return (
                                                    <SelectableTableRow onClick={e => {history.push(`/user/${user.uuid}`)}} title="Trykk for å åpne">
                                                        <TableCell mobileHide consolas flex="3" visible={!visibleUUID}>{ user.uuid }</TableCell>
                                                        <TableCell mobileFlex="2" flex="2">{ user.username }</TableCell>
                                                        <TableCell mobileFlex="3" flex="4">{ user.firstname + ", " + user.lastname}</TableCell>
                                                        <TableCell mobileHide flex="0 24px"><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
                                                    </SelectableTableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </InnerContainer>
                        </InnerContainerRow>
                    </InnerContainerRow>
                </InnerContainer>
            </>
        )
    }

}
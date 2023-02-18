import React, { useState, useEffect } from "react";

import { TableCell, IconContainer, SelectableTableRow, Table, TableHead, TableBody, TableRow } from '../../../components/table';
import { InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputLabel, InputSelect } from '../../../components/dashboard';
import { UserSearch } from "../../../components/userSearch";
import { FormButton } from '../../../components/form';

import { PositionMapping, getCurrentEvent, getEvents } from "@phoenixlan/phoenix.js";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import { PageLoading } from "../../../components/pageLoading";

export const PositionMemberList = ({ position, refresh }) => {
    const [ loading, setLoading ] = useState(true);
    const [ visibleUUID, setVisibleUUID ] = useState(false);
    const [ member, setNewMember ] = useState(null);
    const [ isAddingMember, setIsAddingMember ] = useState(false);

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
                <InnerContainer extramargin>
                    <InnerContainerRow>
                        <InnerContainer flex="1">
                            <InnerContainerTitle>Legg til nytt medlem</InnerContainerTitle>
                            <InnerContainer>Du kan bare gi ut stillingen for nåværende arrangement. Merk at de ikke vil få en e-post for å informere dem den nye stillingen.</InnerContainer>
                            
                            <UserSearch onUserSelected={setNewMember} onChange={() => setNewMember(null)}/>
                            {
                                isAddingMember ? (
                                    <PageLoading />
                                ) : (
                                    <FormButton disabled={!member} type="submit" onClick={() => addMember()}>Legg til medlem</FormButton>
                                )
                            }
                        </InnerContainer>
                        <InnerContainer flex="1">
                            <InnerContainerRow nopadding nowrap>
                                <InputContainer column mobileNoMargin>
                                    <InnerContainerTitle>Vis medlemmer for et annet arrangement</InnerContainerTitle>
                                    <InputLabel small>Arrangement</InputLabel>
                                    <InputSelect value={currentViewingEvent} onChange={updateViewingEvent}>
                                        {
                                            events.map((event) => (<option value={event.uuid}>{event.name} {event.uuid == currentEvent.uuid ? "(Nåværende)" : null}</option>))
                                        }
                                    </InputSelect>
                                </InputContainer>
                            </InnerContainerRow>
                        </InnerContainer>
                        <InnerContainer mobileHide flex="1" />
                    </InnerContainerRow>
                </InnerContainer>

                <InnerContainer>
                    <InnerContainer mobileHide>
                        <InputCheckbox label="Vis UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                    </InnerContainer>
                    <Table>
                        <TableHead border>
                            <TableRow>
                                <TableCell mobileHide flex="5" visible={!visibleUUID}>UUID</TableCell>
                                <TableCell mobileFlex="3" flex="3">Navn</TableCell>
                                <TableCell mobileFlex="2" flex="3">Brukernavn</TableCell>
                                <TableCell mobileHide flex="0 24px" />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                position_mappings.map((position_mapping) => {
                                    const user = position_mapping.user
                                    return (
                                        <SelectableTableRow onClick={e => {history.push(`/user/${user.uuid}`)}} title="Trykk for å åpne">
                                            <TableCell mobileHide consolas flex="5" visible={!visibleUUID}>{ user.uuid }</TableCell>
                                            <TableCell mobileFlex="3" flex="3">{ user.lastname + ", " + user.firstname }</TableCell>
                                            <TableCell mobileFlex="2" flex="3">{ user.username }</TableCell>
                                            <TableCell mobileHide flex="0 24px"><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
                                        </SelectableTableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </InnerContainer>
            </>
        )
    }

}
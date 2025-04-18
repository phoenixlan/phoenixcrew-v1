import React, { useState, useEffect } from "react";

import { TableCell, IconContainer, SelectableTableRow, Table, TableHead, TableBody, TableRow, InnerColumnCenter } from '../../../components/table';
import { CardContainerText, DropdownCardContainer, DropdownCardContent, DropdownCardHeader, InlineContainer, InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputLabel, InputSelect, PanelButton, RowBorder, SpanLink } from '../../../components/dashboard';
import { UserSearch } from "../../../components/userSearch";
import { FormButton } from '../../../components/form';

import { PositionMapping, getCurrentEvent, getEvents } from "@phoenixlan/phoenix.js";

import { faArrowRight, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import { PageLoading } from "../../../components/pageLoading";
import { Notice } from "../../../components/containers/notice";

const messages = {
    "position.addUserTitle": "Legg til bruker",
    "position.addUserDescription": ["Du kan bare gi ut stillingen for nåværende arrangement.", <br/>, "De vil ikke få en e-post for å informere om den nye stillingen.", <br/>, "Brukeren blir nødt til å logge ut og inn for at den nye stillingen skal tre i kraft."],
    "position.filterByEventTitle": "Vis medlemmer fra:"
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
    const [ error, setError ] = useState(null);

    const updateViewingEvent = (event) => {
        setCurrentViewingEvent(event.target.value)
    }

    const currentEventFilter = (position_mapping) => !position_mapping.event_uuid || position_mapping.event_uuid == currentViewingEvent;

    const history = useHistory();

    const addMember = async () => {
        if(currentEvent) {
            if(!member) {
                alert("No member is selected");
            } else {
                try {
                    setIsAddingMember(true);
                    await PositionMapping.createPositionMapping(member, position.uuid);
                    await refresh();
                } catch(e) {
                    alert("An error occured when adding the selected to this position.\n\n" + e)
                    console.error("An error occured when adding this user (" + member + ") to this position (" + position.uuid + ").\n" + e)
                } finally {
                    setIsAddingMember(false);
                }
            }
        } else {
            alert("An error occured when adding the selected user to this position.\nThere is no current event.")
        }

    }

    const load = async () => {
        setLoading(true)
        const [ currentEvent, events ] = await Promise.all([
            getCurrentEvent(),
            getEvents()
        ])

        if(events) {
            setEvents(events);
        }

        if(currentEvent) {
            setCurrentEvent(currentEvent);
            setCurrentViewingEvent(currentEvent.uuid);
        } else {
            setCurrentViewingEvent(events[0].uuid);
        }
        
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
                <InnerContainer visible={error || !currentEvent}>
                    <InnerContainerRow>
                        <Notice fillWidth type="warning" visible={!currentEvent}>
                            Det eksisterer for øyeblikket ingen aktive arrangementer<br/>
                            Du kan derfor kun se hvilke brukere som var lagt til denne stillingen fra tidligere arrangementer, og ikke legge til nye.<br/>
                            Opprett et nytt arrangement for å kunne tildele brukere denne eller andre stillinger.
                        </Notice>
                        <Notice fillWidth type="error" visible={error}>
                            Det oppsto en feil når vi prøvde å legge til brukeren<br/>
                            {error}
                        </Notice>
                    </InnerContainerRow>
                </InnerContainer>

                <InnerContainer desktopHide>
                    <DropdownCardContainer>
                        <DropdownCardHeader title={messages["position.addUserTitle"]} dropdownState={addUserDropdownState} onClick={() => setAddUserDropdownState(!addUserDropdownState)} />
                        <DropdownCardContent dropdownState={addUserDropdownState}>
                            {messages["position.addUserDescription"]}
                            <UserSearch disabled={!currentEvent} onUserSelected={setNewMember} onChange={() => setNewMember(null)} />
                            {
                                isAddingMember ? (
                                    <PageLoading />
                                ) : (
                                    <PanelButton fillWidth disabled={!member} type="submit" onClick={() => addMember()}>Legg til</PanelButton>
                                )
                            }
                        </DropdownCardContent>
                    </DropdownCardContainer>
                </InnerContainer>

                <InnerContainer mobileHide>
                    <InnerContainerRow>
                        <InnerContainerRow>
                            <InnerContainer flex="4" nopadding>
                                <InnerContainerTitle>{messages["position.addUserTitle"]}</InnerContainerTitle>
                                {messages["position.addUserDescription"]}
                            </InnerContainer>
                            <RowBorder />
                            <InnerContainer flex="2" nopadding>
                                <UserSearch disabled={!currentEvent} onUserSelected={setNewMember} onChange={() => setNewMember(null)}/>
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
                    </InnerContainerRow>
                </InnerContainer>

                <InnerContainer>
                    <InnerContainerRow>
                        <InnerContainer flex="1">
                            <InputLabel small>{messages["position.filterByEventTitle"]}</InputLabel>
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
                    <InnerContainerRow>
                        <InnerContainerRow>
                            <InnerContainer>
                                <Table>
                                    <TableHead border>
                                        <TableRow>
                                            <TableCell mobileFlex="0 2rem" flex="0 1.3rem" center title="Indikerer om brukeren innehar denne stillingen permanent eller ikke."><InnerColumnCenter>...</InnerColumnCenter></TableCell>
                                            <TableCell flex="0 1px" mobileHide fillGray />
                                            <TableCell mobileHide flex="3" visible={!visibleUUID}>UUID <SpanLink onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? "(Skjul UUID)" : null}</SpanLink></TableCell>
                                            <TableCell mobileHide flex="2">Brukernavn <SpanLink mobileHide onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? null : "(Vis UUID)"}</SpanLink></TableCell>
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
                                                        <TableCell mobileFlex="0 2rem" flex="0 1.3rem" center><IconContainer hidden={position_mapping.event_uuid} color="#ef6c00"><FontAwesomeIcon icon={faLock} title="Pemrnanent stilling - Brukeren innehar denne stillingen men uten tilknytning til et arrangement." /></IconContainer></TableCell>
                                                        <TableCell flex="0 1px" mobileHide fillGray />
                                                        <TableCell mobileHide consolas flex="3" visible={!visibleUUID}>{ user.uuid }</TableCell>
                                                        <TableCell mobileHide flex="2">{ user.username }</TableCell>
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
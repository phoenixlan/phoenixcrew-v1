import React, { useState, useEffect } from 'react';
import { PageLoading } from "../../../components/pageLoading"
import { SimpleUserCard } from "../../../components/simpleUserCard";

import { InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputLabel, InputSelect, InnerContainerTitleS } from "../../../components/dashboard";
import { useBrand } from "../../../contexts/brand";
import { useEvents } from "../../../hooks/events/useEvents";

export const CrewViewMemberViewer = ({ crew }) => {
    const { brandUuid, currentEvent } = useBrand();
    const { data: events = [], isLoading: eventsLoading } = useEvents(brandUuid);
    const [ loading, setLoading ] = useState(true);

    const [ currentViewingEvent, setCurrentViewingEvent ] = useState(null);

    const updateViewingEvent = (event) => {
        setCurrentViewingEvent(event.target.value)
    }

    const currentEventFilter = (position_mapping) => !position_mapping.event_uuid || position_mapping.event_uuid == currentViewingEvent;

    const load = async () => {
        setLoading(true)
        setCurrentViewingEvent(currentEvent?.uuid ?? events[0]?.uuid ?? null);
        setLoading(false);
    }

    useEffect(async () => {
        await load();
    }, [currentEvent, events])

    if(loading || eventsLoading) {
        return (
            <PageLoading />
        )
    }
    else {
        const memberMap = new Map();
        const chiefMap  = new Map();
        crew.positions.forEach((position) => {
            if(position.chief) {
                position.position_mappings.filter(currentEventFilter).forEach((mapping) => {
                    const user = mapping.user
                    if(!chiefMap.has(user.uuid)) {
                        chiefMap.set(user.uuid, user);
                    }
                })
            }
            position.position_mappings.filter(currentEventFilter).forEach((mapping) => {
                const user = mapping.user
                if(!memberMap.has(user.uuid)) {
                    memberMap.set(user.uuid, user);
                }
            })
        })
        const leaders = Array.from(chiefMap.values());
        const members = Array.from(memberMap.values());

        return (<>
            <InnerContainer extramargin border>
                <InnerContainerRow nopadding>
                    <InnerContainer flex="1">
                        <InnerContainerRow nopadding nowrap>
                            <InputContainer column mobileNoMargin>
                                <InputLabel small>Arrangement</InputLabel>
                                <InputSelect value={currentViewingEvent} onChange={updateViewingEvent}>
                                    {
                                        events.map((event) => (<option value={event.uuid}>{event.name} {event.uuid == currentEvent.uuid ? "(Nåværende)" : null}</option>))
                                    }
                                </InputSelect>
                            </InputContainer>
                        </InnerContainerRow>
                    </InnerContainer>
                    <InnerContainer flex="1" mobileHide />
                    <InnerContainer flex="1" mobileHide />
                </InnerContainerRow>
            </InnerContainer>

            <InnerContainer>
                <InnerContainerTitle nopadding>Medlemmer</InnerContainerTitle>
                <InnerContainerTitleS nopadding>Gruppeledere ({leaders.length})</InnerContainerTitleS>
                <InnerContainerRow>
                    {
                        leaders.map(user => (<SimpleUserCard user={user} key={user.uuid} />))
                    }
                </InnerContainerRow>

                <InnerContainerTitleS nopadding>Crew medlemmer ({members.length})</InnerContainerTitleS>
                <InnerContainerRow>
                    {
                        members.map(user => (<SimpleUserCard user={user} key={user.uuid} />))
                    }
                </InnerContainerRow>
            </InnerContainer>
        </>)
    }
}

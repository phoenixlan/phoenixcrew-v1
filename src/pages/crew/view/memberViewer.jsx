import React, { useState } from 'react';
import { PageLoading } from "../../../components/pageLoading"
import { SimpleUserCard } from "../../../components/simpleUserCard";

import { InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputLabel, InputSelect, InnerContainerTitleS } from "../../../components/dashboard";
import { useCurrentEvent, useEvents } from "../../../hooks/useEvent";

export const CrewViewMemberViewer = ({ crew }) => {
    const { data: currentEvent, isLoading: currentEventLoading } = useCurrentEvent();
    const { data: events, isLoading: eventsLoading } = useEvents();

    const [ currentViewingEvent, setCurrentViewingEvent ] = useState(null);

    const updateViewingEvent = (event) => {
        setCurrentViewingEvent(event.target.value)
    }

    const viewingEvent = currentViewingEvent || currentEvent?.uuid;
    const currentEventFilter = (position_mapping) => !position_mapping.event_uuid || position_mapping.event_uuid == viewingEvent;

    const loading = currentEventLoading || eventsLoading;

    if(loading) {
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
                                <InputSelect value={viewingEvent} onChange={updateViewingEvent}>
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

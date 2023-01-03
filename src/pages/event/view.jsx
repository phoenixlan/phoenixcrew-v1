import React , { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';

import { getEvent } from "@phoenixlan/phoenix.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle }  from '@fortawesome/free-solid-svg-icons'
import { PageLoading } from "../../components/pageLoading"

import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputElement, InputLabel, InputSelect, LabelWarning } from "../../components/dashboard";


export const EventViewer = () => {
    const [event, setEvent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeContent, setActiveContent] = useState(1);
    const [cancelEventCheck, setCancelEventCheck] = useState(false);
    const [cancelEventReason, setCancelEventReason] = useState(null);

    const { uuid } = useParams();
    let history = useHistory();

    useEffect(async () => {
        setLoading(true);
        const event = await getEvent(uuid);
        setEvent(event);

        if(event.cancellation_reason) {
            setCancelEventCheck(true);
            setCancelEventReason(event.cancellation_reason);
        }

        setLoading(false);
    }, []);

    // Function to handle when the checkbox for cancelling the event is clicked.
    const changeCancelEventCheck = () => {
        if(cancelEventCheck) {
            setCancelEventCheck(false);
            setCancelEventReason(null);
        } else {
            setCancelEventCheck(true);
            setCancelEventReason("");
        }

        
    }
    
    // View loading page if loading is true
    if(loading) {
        return (<PageLoading />)
    }
    
    return (
        <>
            <DashboardHeader>
                <DashboardTitle>
                    Arrangement
                </DashboardTitle>
                <DashboardSubtitle>
                    {event.name}
                </DashboardSubtitle>
            </DashboardHeader>

            <DashboardBarSelector border>
                <DashboardBarElement active={activeContent == 1} onClick={() => setActiveContent(1)}>Innstillinger</DashboardBarElement>
            </DashboardBarSelector>

            <DashboardContent visible={activeContent == 1}>
                <InnerContainer border extramargin>
                    <InputCheckbox label="Kanseller arrangementet" value={cancelEventCheck} onChange={() => changeCancelEventCheck()} disabled />
                </InnerContainer>

                <InnerContainer>
                    <form>
                        <InnerContainerRow>
                            <InnerContainer flex="1">
                                <InnerContainerTitle>Generelle innstillinger for arrangementet</InnerContainerTitle>
                                <InnerContainerRow nopadding nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Navn</InputLabel>
                                        <InputElement type="text" value={event.name} disabled />
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Sted</InputLabel>
                                        <InputElement type="text" value={event.location} disabled />
                                    </InputContainer>
                                </InnerContainerRow>

                                <InnerContainerRow nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Tema</InputLabel>
                                        <InputElement type="text" value={event.theme} disabled />
                                    </InputContainer>
                                    <InputContainer />
                                </InnerContainerRow>
                                
                                <InnerContainerTitle>Billetter og øvre aldersgrense</InnerContainerTitle>
                                <InnerContainerRow nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Antall plasser</InputLabel>
                                        <InputElement type="number" value={event.max_participants} disabled />
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Øvre aldersgrense</InputLabel>
                                        <InputElement type="number" value={event.age_limit_inclusive} disabled />
                                    </InputContainer>
                                </InnerContainerRow>
                                
                                <InnerContainerTitle>Arrangementstid og booking</InnerContainerTitle>
                                <InnerContainerRow nopadding nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Arrangementstid Start</InputLabel>
                                        <InputElement type="datetime-local" value={new Date(event.start_time*1000).toISOString().slice(0, -8)} disabled />
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Arrangementstid Slutt</InputLabel>
                                        <InputElement type="datetime-local" value={new Date(event.end_time*1000).toISOString().slice(0, -8)} disabled />
                                    </InputContainer>
                                </InnerContainerRow>

                                <InnerContainerRow nopadding nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Billettslipp</InputLabel>
                                        <InputElement type="datetime-local" value={new Date(event.booking_time*1000).toISOString().slice(0, -8)} disabled />
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Prioritert seating</InputLabel>
                                        <InputElement type="datetime-local" value={new Date(event.booking_time*1000+event.priority_seating_time_delta*1000).toISOString().slice(0, -8)} disabled />
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Normal seating</InputLabel>
                                        <InputElement type="datetime-local" value={new Date((event.booking_time*1000)+(event.seating_time_delta*1000)).toISOString().slice(0, -8)} disabled />
                                    </InputContainer>
                                </InnerContainerRow>

                                <InnerContainerRow nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Setekart</InputLabel>
                                        <InputSelect disabled>
                                            <option>...</option>
                                        </InputSelect>
                                    </InputContainer>
                                    <InputContainer />
                                </InnerContainerRow>
                                
                            </InnerContainer>
                            <InnerContainer flex="1">
                                <InnerContainerTitle>Kansellering av arrangementet</InnerContainerTitle>
                                <InnerContainerRow nopadding nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Begrunnelse for kansellering <LabelWarning 
                                            title="'Kansellering av arrangementet' er huket av!&#10;Dersom du lagrer vil arrangementet vises som kansellert." 
                                            visible={cancelEventCheck}><FontAwesomeIcon icon={faExclamationTriangle} /></LabelWarning></InputLabel>
                                        <InputElement type="text" defaultValue={cancelEventReason} disabled={!cancelEventCheck} />
                                    </InputContainer>
                                </InnerContainerRow>
                            </InnerContainer>
                        </InnerContainerRow>
                    </form>
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
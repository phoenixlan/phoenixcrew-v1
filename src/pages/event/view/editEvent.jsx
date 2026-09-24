import { CardContainer, CardContainerText, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputElement, InputLabel, PanelButton } from "../../../components/dashboard";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { PageLoading } from "../../../components/pageLoading";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Notice } from "../../../components/containers/notice";
import { useForm } from "react-hook-form";
import { captureException } from "@sentry/react";
import { getEvent, modifyEvent } from "@phoenixlan/phoenix.js";

export const EditEvent = () => {

    const { uuid } = useParams();
    const [ event, setEvent ] = useState(undefined);

    let history = useHistory();

    const { register, handleSubmit } = useForm();

    // Variables to keep track of changes in input components
    const [ name, setName ] = useState(null);
    const [ theme, setTheme ] = useState(null);
    const [ location, setLocation ] = useState(null);
    const [ startTimeISO, setStartTimeISO ] = useState(null);
    const [ endTimeISO, setEndTimeISO ] = useState(null);
    const [ bookingTimeISO, setBookingTimeISO ] = useState(null);
    const [ prioritySeatingTimeDeltaISO, setPrioritySeatingTimeDeltaISO ] = useState(null);
    const [ seatingTimeDeltaISO, setSeatingTimeDeltaISO ] = useState(null);
    const [ maxParticipants, setMaxParticipants ] = useState(null);
    const [ participantAgeLimitInclusive, setParticipantAgeLimitInclusive ] = useState(null);
    const [ crewAgeLimitInclusive, setCrewAgeLimitInclusive ] = useState(null);

    // States for error and success, used when attempting to fetch user and update user
    const [ error, setError ] = useState(false);
    const [ updateSuccess, setUpdateSuccess ] = useState(false);

    const [ loading, setLoading ] = useState(true);

    const onSubmit = async (data) => {

        data.priority_seating_time_delta = data.priority_seating_time_delta ? new Date(data.priority_seating_time_delta).getTime()/1000 - new Date(data.booking_time).getTime()/1000 : null;
        data.seating_time_delta = data.seating_time_delta ? new Date(data.seating_time_delta).getTime()/1000 - new Date(data.booking_time).getTime()/1000 : null;
        data.start_time = data.start_time ? new Date(data.start_time).getTime()/1000 : null;
        data.end_time = data.end_time ? new Date(data.end_time).getTime()/1000 : null;
        data.booking_time = data.booking_time ? new Date(data.booking_time).getTime()/1000 : null;
        data.crew_age_limit_inclusive = Number(data.crew_age_limit_inclusive);
        data.participant_age_limit_inclusive = Number(data.participant_age_limit_inclusive);
        data.max_participants = Number(data.max_participants);

        try {
            await modifyEvent(data.uuid, data);
            await reload();
            setUpdateSuccess(true);
            setError(false);
        } catch(e) {
            setError(e.message);
            captureException(e);
            setUpdateSuccess(false);
            console.error("An error occured while attempting to update the event.\n" + e);
        }
    }

    const reload = async () => {
        setLoading(true)

        let event;

        try {
            event = await getEvent(uuid);

            // Fix timezone issue
            const startTimeTimezoneOffset = new Date(event.start_time*1000).getTimezoneOffset();
            const endTimeTimezoneOffset = new Date(event.end_time*1000).getTimezoneOffset();
            const bookingTimeTimezoneOffset = new Date(event.booking_time*1000).getTimezoneOffset();

            setName(event.name);
            setTheme(event.theme);
            setLocation(event.location_uuid);
            setStartTimeISO(event.start_time ? new Date(event.start_time*1000-(60000*startTimeTimezoneOffset)).toISOString().slice(0, 16) : undefined);
            setEndTimeISO(event.end_time ? new Date(event.end_time*1000-(60000*endTimeTimezoneOffset)).toISOString().slice(0, 16) : undefined);
            setBookingTimeISO(event.booking_time ? new Date(event.booking_time*1000-(60000*bookingTimeTimezoneOffset)).toISOString().slice(0, 16) : undefined);
            setPrioritySeatingTimeDeltaISO(event.priority_seating_time_delta ? new Date((event.booking_time+event.priority_seating_time_delta)*1000-(60000*bookingTimeTimezoneOffset)).toISOString().slice(0, 16) : undefined);
            setSeatingTimeDeltaISO(event.seating_time_delta ? new Date((event.booking_time+event.seating_time_delta)*1000-(60000*bookingTimeTimezoneOffset)).toISOString().slice(0, 16) : undefined);
            setMaxParticipants(Number(event.max_participants));
            setParticipantAgeLimitInclusive(Number(event.participant_age_limit_inclusive));
            setCrewAgeLimitInclusive(Number(event.crew_age_limit_inclusive));
        } catch(e) {
            setError(e);
            captureException(e);
            console.error("An error occured while attempting to gather event information:\n" + e);
        }

        if(event) {
            setEvent(event);
        }

        setLoading(false);
    }

    useEffect(async () => {
        reload();
    }, [])

    if(loading) {
        return (<PageLoading />)
    }
    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Rediger arrangement
                </DashboardTitle>
                <DashboardSubtitle>
                    {event.name}
                </DashboardSubtitle>
            </DashboardHeader>

            <DashboardContent>
                <InnerContainer>
                    <InnerContainerRow>
                        <PanelButton onClick={handleSubmit(onSubmit)} icon={faCheck}>Oppdater informasjon</PanelButton>
                        <PanelButton onClick={() => history.push("/event/" + event.uuid)} icon={faXmark}>Avbryt</PanelButton>
                    </InnerContainerRow>
                </InnerContainer>

                <InnerContainer>
                    <InnerContainerRow>
                        <InnerContainer visible={error || updateSuccess}>
                            <Notice type="error" visible={error && !updateSuccess}>
                                {error}
                            </Notice>
                            <Notice type="success" visible={updateSuccess && !error}>
                                <span>Arrangementet ble oppdatert.</span>
                            </Notice>
                        </InnerContainer>

                        <InnerContainer flex="1" floattop>
                            <InputElement type="hidden" value={event.uuid} {...register("uuid")} />
                            
                            <InnerContainerTitle>Generelle innstillinger for arrangementet</InnerContainerTitle>
                            <InnerContainerRow nopadding mobileNoGap>
                                <CardContainer>
                                    <CardContainerText>
                                        <InputLabel small>Navn</InputLabel>
                                        <InputElement {...register("name")} type="text" value={name} onChange={(e) => setName(e.target.value)} />
                                    </CardContainerText>
                                </CardContainer>
                            </InnerContainerRow>
                            <InnerContainerRow nopadding mobileNoGap>
                                <CardContainer>
                                    <CardContainerText>
                                        <InputLabel small>Tema</InputLabel>
                                        <InputElement {...register("theme")} type="text" value={theme} onChange={(e) => setTheme(e.target.value)} />
                                    </CardContainerText>
                                </CardContainer>
                            </InnerContainerRow>
                            <InnerContainerRow nopadding mobileNoGap>
                                <CardContainer>
                                    <CardContainerText>
                                        <InputLabel small>Sted</InputLabel>
                                        <InputElement disabled />
                                    </CardContainerText>
                                </CardContainer>
                            </InnerContainerRow>
                        </InnerContainer>

                        <InnerContainer flex="1" floattop>
                            <InnerContainerRow>
                                <InnerContainer flex="1" floattop>
                                    <InnerContainer flex="1" floattop>
                                        <InnerContainerTitle>Arrangementstid og booking</InnerContainerTitle>
                                        <InnerContainerRow>
                                            <CardContainer>
                                                <CardContainerText>
                                                    <InputLabel small>Arrangementets start</InputLabel>
                                                    <InputElement {...register("start_time", {required: true})} type="datetime-local" value={startTimeISO} onChange={(e) => setStartTimeISO(e.target.value)} />
                                                </CardContainerText>
                                            </CardContainer>
                                        </InnerContainerRow>

                                        <InnerContainerRow>
                                            <CardContainer>
                                                <CardContainerText>
                                                    <InputLabel small>Arrangementets slutt</InputLabel>
                                                    <InputElement {...register("end_time", {required: true})} type="datetime-local" value={endTimeISO} onChange={(e) => setEndTimeISO(e.target.value)} />
                                                </CardContainerText>
                                            </CardContainer>
                                        </InnerContainerRow>

                                        <InnerContainerRow>
                                            <CardContainer>
                                                <CardContainerText>
                                                    <InputLabel small>Billettslipp</InputLabel>
                                                    <InputElement {...register("booking_time", {required: true})} type="datetime-local" value={bookingTimeISO} onChange={(e) => setBookingTimeISO(e.target.value)} />
                                                </CardContainerText>
                                            </CardContainer>
                                        </InnerContainerRow>

                                        <InnerContainerRow>
                                            <CardContainer>
                                                <CardContainerText>
                                                    <InputLabel small>Åpning av prioritert seating</InputLabel>
                                                    <InputElement {...register("priority_seating_time_delta", {required: true})} type="datetime-local" value={prioritySeatingTimeDeltaISO} onChange={(e) => setPrioritySeatingTimeDeltaISO(e.target.value)} />
                                                </CardContainerText>
                                            </CardContainer>
                                        </InnerContainerRow>

                                        <InnerContainerRow>
                                            <CardContainer>
                                                <CardContainerText>
                                                    <InputLabel small>Åpning av normal seating</InputLabel>
                                                    <InputElement {...register("seating_time_delta", {required: true})} type="datetime-local" value={seatingTimeDeltaISO} onChange={(e) => setSeatingTimeDeltaISO(e.target.value)} />
                                                </CardContainerText>
                                            </CardContainer>
                                        </InnerContainerRow>
                                    </InnerContainer>
                                </InnerContainer>

                                <InnerContainer flex="1" floattop>
                                    <InnerContainer>
                                        <InnerContainerTitle>Billetter og øvre aldersgrenser</InnerContainerTitle>
                                        <InnerContainerRow>
                                            <CardContainer>
                                                <CardContainerText>
                                                    <InputLabel small>Antall plasser</InputLabel>
                                                    <InputElement {...register("max_participants")} type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} />
                                                </CardContainerText>
                                            </CardContainer>
                                        </InnerContainerRow>

                                        <InnerContainerRow>
                                            <CardContainer>
                                                <CardContainerText>
                                                    <InputLabel small>Øvre aldersgrense for deltakere</InputLabel>
                                                    <InputElement {...register("participant_age_limit_inclusive")} type="number" value={participantAgeLimitInclusive} onChange={(e) => setParticipantAgeLimitInclusive(e.target.value)} />
                                                </CardContainerText>
                                            </CardContainer>
                                        </InnerContainerRow>

                                        <InnerContainerRow>
                                            <CardContainer>
                                                <CardContainerText>
                                                    <InputLabel small>Øvre aldersgrense for crew</InputLabel>
                                                    <InputElement {...register("crew_age_limit_inclusive")} type="number" value={crewAgeLimitInclusive} onChange={(e) => setCrewAgeLimitInclusive(e.target.value)} />
                                                </CardContainerText>
                                            </CardContainer>
                                        </InnerContainerRow>
                                    </InnerContainer>
                                </InnerContainer>
                            </InnerContainerRow>
                        </InnerContainer>
                    </InnerContainerRow>
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
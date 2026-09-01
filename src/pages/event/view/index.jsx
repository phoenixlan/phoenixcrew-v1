import { useContext, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { getEvent, getEventTicketTypes, TicketType, Seatmap } from "@phoenixlan/phoenix.js";
import { PageLoading } from "../../../components/pageLoading";
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow } from "../../../components/dashboard";
import { EventDetails } from "./details";
import { EventTickets } from "./tickets";
import { AuthenticationContext } from "../../../components/authentication";
import { Notice } from "../../../components/containers/notice";

export const EventViewer = () => {

    // Import the following React contexts:
    const authContext = useContext(AuthenticationContext);

    // Function availibility control:
    const viewEvent = authContext.roles.includes("admin") || authContext.roles.includes("event_admin");
    const [error, setError] = useState(false);
    const [event, setEvent] = useState(null);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [eventTicketTypes, setEventTicketTypes] = useState([]);
    const [seatMaps, setSeatmaps] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeContent, setActiveContent] = useState(1);

    const [selectedTicketTypeUuid, setSelectedTicketTypeUuid] = useState("");

    const { uuid } = useParams();

    const load = async () => {
        if(viewEvent) {
            const [ event, ticketTypes, seatMaps, eventTicketTypes ] = await Promise.all([
                    getEvent(uuid),
                    TicketType.getTicketTypes(),
                    Seatmap.getSeatmaps(),
                    getEventTicketTypes(uuid)
                ]
            )

            const legalTicketTypes = ticketTypes.filter(ticketType => {
                return ticketType.price !== 0 && eventTicketTypes.filter((type) => type.uuid === ticketType.uuid).length === 0;
            });

            if(legalTicketTypes.length > 0) {
                setSelectedTicketTypeUuid(legalTicketTypes[0].uuid);
            } else {
                setSelectedTicketTypeUuid("");
            }

            setTicketTypes(legalTicketTypes);
            setEvent(event);
            setEventTicketTypes(eventTicketTypes); 
            setSeatmaps(seatMaps);
        }
    }

    useEffect(async () => {
        await load().catch(e => {
            setError(e);
            console.error(e);
        })
        setLoading(false);
    }, []);
    
    // View loading page if loading is true
    if(loading) {
        return (<PageLoading />)
    } else if(viewEvent) {
        if(event)
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
                        <DashboardBarElement active={activeContent == 1} onClick={() => setActiveContent(1)}>Generelt</DashboardBarElement>
                        <DashboardBarElement active={activeContent == 2} onClick={() => setActiveContent(2)}>Billettstyring</DashboardBarElement>
                    </DashboardBarSelector>

                    <DashboardContent visible={activeContent == 1}>
                        <EventDetails event={event} refresh={load} />
                    </DashboardContent>

                    <DashboardContent visible={activeContent == 2}>
                        <EventTickets event={event} ticketTypes={ticketTypes} eventTicketTypes={eventTicketTypes} seatMaps={seatMaps} refresh={load} />
                    </DashboardContent>
                </>
            )
        else {
            return (
                <>
                    <DashboardHeader border>
                        <DashboardTitle>
                            Arrangement
                        </DashboardTitle>
                    </DashboardHeader>

                    <DashboardContent>
                        <Notice type="error" visible>
                            Det oppsto en feil ved henting av informasjon for dette arrangementet.<br />
                            {error.message}
                        </Notice>
                    </DashboardContent>
                </>
            )
        }
    } else {
        return (
            <>
                <DashboardContent>
                    <InnerContainer rowgap>
                        <InnerContainerRow>
                            <Notice type="error" visible>
                                Du har ikke tilgang til å administrere arrangementer.
                            </Notice>
                        </InnerContainerRow>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
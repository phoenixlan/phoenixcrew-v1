import React , { useContext, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { getEvent, getEventTicketTypes, addEventTicketType, TicketType, Seatmap } from "@phoenixlan/phoenix.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle }  from '@fortawesome/free-solid-svg-icons'
import { PageLoading } from "../../../components/pageLoading"
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputElement, InputLabel, InputSelect, LabelWarning } from "../../../components/dashboard";
import { FormButton } from "../../../components/form";
import { EventDetails } from "./details";
import { EventTickets } from "./tickets";
import { AuthenticationContext } from "../../../components/authentication";

export const EventViewer = () => {

    // Import the following React contexts:
    const authContext = useContext(AuthenticationContext);

    // Function availibility control:
    const viewEvent = authContext.roles.includes("admin") || authContext.roles.includes("event_admin")

    const [event, setEvent] = useState([]);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [eventTicketTypes, setEventTicketTypes] = useState([]);
    const [seatMaps, setSeatmaps] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeContent, setActiveContent] = useState(1);
//    const [cancelEventCheck, setCancelEventCheck] = useState(false);
//    const [cancelEventReason, setCancelEventReason] = useState(null);

    const [selectedTicketTypeUuid, setSelectedTicketTypeUuid] = useState("");

    const { uuid } = useParams();

    const load = async () => {
        if(viewEvent) {
            const [ event, ticketTypes, seatMaps ] = await Promise.all([
                    getEvent(uuid),
                    TicketType.getTicketTypes(),
                    Seatmap.getSeatmaps(),
                ]
            )
            const eventTicketTypes = await getEventTicketTypes(event.uuid);
            const legalTicketTypes = ticketTypes.filter(ticketType => {
                return ticketType.price !== 0 && eventTicketTypes.filter((type) => type.uuid === ticketType.uuid).length === 0;
            });

            if(legalTicketTypes.length > 0) {
                setSelectedTicketTypeUuid(legalTicketTypes[0].uuid);
            } else {
                setSelectedTicketTypeUuid("")
            }

            setTicketTypes(legalTicketTypes);
            setEvent(event);
            setEventTicketTypes(eventTicketTypes); 
            setSeatmaps(seatMaps);
        }
        setLoading(false);
    }

    useEffect(async () => {
        await load();
    }, []);

    // Function to handle when the checkbox for cancelling the event is clicked.
/*    const changeCancelEventCheck = () => {
        if(cancelEventCheck) {
            setCancelEventCheck(false);
            setCancelEventReason(null);
        } else {
            setCancelEventCheck(true);
            setCancelEventReason("");
        }
    }
*/
/*    const changeSelectedTicketType = (event) => {
        setSelectedTicketTypeUuid(event.target.value)
    }
*/
/*    const addTicketType = async (e) => {
        e.preventDefault()
        if(selectedTicketTypeUuid !== "") {
            console.log(selectedTicketTypeUuid)
            await addEventTicketType(event.uuid, selectedTicketTypeUuid)
            reload();
        } else {
            alert("No ticket type left to add")
        }
    }
*/
    
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
                <DashboardBarElement active={activeContent == 1} onClick={() => setActiveContent(1)}>Generelt</DashboardBarElement>
                <DashboardBarElement active={activeContent == 2} onClick={() => setActiveContent(2)}>Billettstyring</DashboardBarElement>
            </DashboardBarSelector>

            <DashboardContent visible={activeContent == 1}>
                <EventDetails event={event} />
            </DashboardContent>

            <DashboardContent visible={activeContent == 2}>
                <EventTickets event={event} ticketTypes={ticketTypes} eventTicketTypes={eventTicketTypes} seatMaps={seatMaps} refresh={load} />
            </DashboardContent>
        </>
    )
}
import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom';
import { getActiveStoreSessions, getEventTickets, getCurrentEvent, User, Ticket, TicketType } from "@phoenixlan/phoenix.js";
import { Table, TableCell, TableHead, IconContainer, SelectableTableRow, TableRow, TableBody } from "../../components/table";
import { PageLoading } from "../../components/pageLoading";
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow } from "../../components/dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCheck, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { BarElement, FlexBar } from "../../components/bar";

export const TicketList = () => {
    const [ tickets, setTickets ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const [ event, setEvent ] = useState(undefined);
    const [ ticketsFree, setTicketsFree ] = useState(0);
    const [ ticketsBought, setTicketsBought ] = useState(0);
    const [ ticketsHeld, setTicketsHeld ] = useState(0);
    const [ checkedinTickets, setCheckedinTickets ] = useState(0);

    const [ ticketsProgressBar, setTicketsProgressBar ] = useState(undefined);
    const [ checkedinTicketsProgressBar, setCheckedinTicketsProgressBar] = useState(undefined);

    const [ sortingMethodTicket, setSortingMethodTicket ] = useState(1);

    let history = useHistory();

    const reload = async () => {

        const localEvent = await getCurrentEvent();
        
        const [ tickets, storeSessions, allTicketTypes ] = await Promise.all([
            getEventTickets(localEvent.uuid),
            getActiveStoreSessions(),
            TicketType.getTicketTypes()
        ])

        setTickets(tickets);
        setEvent(localEvent);

        // Count all tickets which is held in store sessions
        let heldTickets = 0; 
        storeSessions.map((storeSession) => {
            storeSession.entries.map((entry) => {
                if(entry.ticket_type.seatable) {
                    heldTickets += entry.amount;
                }  
            })
        })
        setTicketsHeld(heldTickets);


        // Logic to create progressbars for tickets and checked in tickets
        let ticketsProgressBar = [];
        let checkedinTicketsProgressBar = [];

        let availableTickets = localEvent.max_participants - tickets.filter((ticket) => ticket.ticket_type.seatable == true).length - heldTickets; 

        let ticketsCheckedinCount = 0;
        let ticketsNotCheckedinCount = 0;

        // Go through all tickets, filter out non-seatable tickets, sort after price, count tickets for each type and if they are checked in or not.
        // Logic for creating the tickets progressbar
        allTicketTypes
            .filter((ticketType) => ticketType.seatable == true)
            .sort((a, b) => a.price < b.price)
            .map((ticketType) => {
                let countedTicketsForTicketType = 0;
    
                tickets
                .filter((ticket) => ticket.ticket_type.uuid == ticketType.uuid && ticket.ticket_type.seatable == true)
                .map((ticket) => {
                    countedTicketsForTicketType++;
                    ticket.checked_in ? ticketsCheckedinCount++ : ticketsNotCheckedinCount++;
                })
    
                ticketsProgressBar.push({
                    key: ticketType.uuid,
                    color: ticketType.price ? "green" : "stripedGreen",
                    title: ticketType.name + " - " + countedTicketsForTicketType,
                    width: countedTicketsForTicketType
                })
            })
        ticketsProgressBar.push({
            key: "availableTickets",
            color: "gray",
            title: "Tilgjengelige billetter - " + availableTickets,
            width: availableTickets
        })
        ticketsProgressBar.push({
            key: "reservedTickets",
            color: "stripedOrange",
            title: "Billetter reservert i kjøp - " + heldTickets,
            width: heldTickets
        })
        setTicketsProgressBar(ticketsProgressBar);

        // Logic for creating the checkedintickets progressbar
        checkedinTicketsProgressBar.push({
            key: "ceckedinTickets",
            color: "green",
            title: "Billetter sjekket inn - " + ticketsCheckedinCount,
            width: ticketsCheckedinCount
        })
        checkedinTicketsProgressBar.push({
            key: "notCheckedinTickets",
            color: "gray",
            title: "Billetter ikke sjekket inn - " + ticketsNotCheckedinCount,
            width: ticketsNotCheckedinCount
        })
        setCheckedinTicketsProgressBar(checkedinTicketsProgressBar);

        setLoading(false);
    }

    useEffect(() => {
        reload();
    }, []);

    const checkin = async (ticket_id) => {
        setLoading(true);
        await Ticket.checkInTicket(ticket_id);
        await reload();
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
                        Billetter
                    </DashboardTitle>
                    <DashboardSubtitle>
                        {tickets.length} salg for dette arrangementet
                    </DashboardSubtitle>
                </DashboardHeader>
                <DashboardContent>
                    <InnerContainerRow>
                        <InnerContainer flex="2">
                            Sortering av billetter:<br/>
                            <i>Funksjonen er ikke tilgjengelig</i>
                        </InnerContainer>
                        <InnerContainer flex="1" mobileHide />
                        <InnerContainer flex="2">
                            Graf over billetter:
                            <FlexBar>
                                {ticketsProgressBar.map((object) => {
                                    return (<BarElement color={object.color} title={object.title} width={object.width} />)
                                })}
                            </FlexBar>
                        </InnerContainer>
                        <InnerContainer flex="2">
                            Graf over innsjekkede billetter:
                            <FlexBar>
                                {checkedinTicketsProgressBar.map((object) => {
                                    return (<BarElement color={object.color} title={object.title} width={object.width} />)
                                })}
                            </FlexBar>
                        </InnerContainer>
                    </InnerContainerRow>
                    
    
                    <InnerContainer>
                        <Table>
                            <TableHead border>
                                <TableRow>
                                    <TableCell as="th" flex="1" mobileFlex="2">ID</TableCell>
                                    <TableCell as="th" flex="2" mobileHide>Billett type</TableCell>
                                    <TableCell as="th" flex="4" mobileFlex="7">Eies av bruker</TableCell>
                                    <TableCell as="th" flex="4" mobileHide>Kjøpt av bruker</TableCell>
                                    <TableCell as="th" flex="4" mobileHide>Seates av bruker</TableCell>
                                    <TableCell as="th" flex="2" mobileFlex="2">Sete</TableCell>
                                    <TableCell as="th" flex="3" mobileHide>Kjøpetid</TableCell>
                                    
                                    <TableCell as="th" center flex="0 24px" title="Statusikon: Ikon vises dersom billetten har blitt sjekket inn"><IconContainer>...</IconContainer></TableCell>
                                    <TableCell as="th" center flex="0 24px" title="Trykk for å åpne"><IconContainer>...</IconContainer></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    tickets.map((ticket) => {
                                        return (
                                            <SelectableTableRow title="Trykk for å åpne" onClick={e => {history.push(`/ticket/${ticket.ticket_id}`)}}>
                                                <TableCell consolas flex="1" mobileFlex="2">#{ ticket.ticket_id }</TableCell>
                                                <TableCell flex="2" mobileHide>{ ticket.ticket_type.name }</TableCell>
                                                <TableCell flex="4" mobileFlex="7">{ User.getFullName(ticket.owner) }</TableCell>
                                                <TableCell flex="4" mobileHide>{ User.getFullName(ticket.buyer) }</TableCell>
                                                <TableCell flex="4" mobileHide>{ User.getFullName(ticket.seater) }</TableCell>
                                                <TableCell flex="2" mobileFlex="2">{ ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "" }</TableCell>
                                                <TableCell flex="3" mobileHide>{ new Date(ticket.created*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) }</TableCell>
                                                <TableCell flex="0 24px" center><IconContainer hidden={!ticket.checked_in} color="#43a047"><FontAwesomeIcon icon={faCheck} title="Billetten er sjekket inn" /></IconContainer></TableCell>
                                                <TableCell flex="0 24px" center><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
                                            </SelectableTableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
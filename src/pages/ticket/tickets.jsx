import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom';
import { getActiveStoreSessions, getEventTickets, getCurrentEvent, User, Ticket } from "@phoenixlan/phoenix.js";
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

    const [ sortingMethodTicket, setSortingMethodTicket ] = useState(1);

    let history = useHistory();

    const reload = async () => {

        const localEvent = await getCurrentEvent();
        
        const [ tickets, storeSessions ] = await Promise.all([
            getEventTickets(localEvent.uuid),
            getActiveStoreSessions()
        ])

        setTickets(tickets);
        setEvent(localEvent);

        // Count all tickets which is free (Price == 0)
        const ticketsFree = tickets.filter(ticket => ticket.ticket_type.price == 0);
        setTicketsFree(ticketsFree);

        // Count all tickets which has been bought (Price > 0)
        const ticketsBought = tickets.filter(ticket => ticket.ticket_type.price > 0);
        setTicketsBought(ticketsBought);

        // Count all tickets which is held in store sessions
        let heldTickets = 0; 
        storeSessions.map((storeSession) => {
            storeSession.entries.map((entry) => {
                heldTickets += entry.amount;
            })

        })
        setTicketsHeld(heldTickets);

        // Count all tickets that has been checked in (checked_in != null)
        let localCheckedinTickets = 0;
        tickets.map((ticket) => {
            if(ticket.checked_in != null) {
                localCheckedinTickets++
            } 
        })
        setCheckedinTickets(localCheckedinTickets);



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
                        {tickets.length} billetter registrert for dette arrangementet
                    </DashboardSubtitle>
                </DashboardHeader>
                <DashboardContent>
                    <InnerContainerRow>
                        <InnerContainer flex="1">
                            Sortering av billetter kommer...
                        </InnerContainer>
                        <InnerContainer flex="1" />
                        <InnerContainer flex="2">
                            Graf over billetter:
                            <FlexBar>
                                <BarElement color="stripedGreen" title={"Gratisbilletter - " + ticketsFree.length} width={ticketsFree.length} />
                                <BarElement color="green" title={"Kjøpte billetter - " + ticketsBought.length} width={ticketsBought.length} />
                                <BarElement color="lightgray" title={"Tilgjengelige billetter - " + (event.max_participants - tickets.length) + " av " + event.max_participants} width={event.max_participants - tickets.length - ticketsHeld} />
                                <BarElement color="stripedOrange" title={"Billetter reservert i kjøp - " + ticketsHeld} width={ticketsHeld} />
                            </FlexBar>
                        </InnerContainer>
                        <InnerContainer flex="2">
                            Graf over innsjekkede billetter:
                            <FlexBar>
                                <BarElement color="green" title={"Billetter sjekket inn - " + checkedinTickets} width={checkedinTickets} />
                                <BarElement color="lightgray" title={"Billetter ikke sjekket inn - " + (tickets.length - checkedinTickets)} width={tickets.length - checkedinTickets} />
                            </FlexBar>
                        </InnerContainer>
                    </InnerContainerRow>
                    
    
                    <InnerContainer>
                        <Table>
                            <TableHead border>
                                <TableRow>
                                    <TableCell as="th" flex="1" mobileFlex="2">ID</TableCell>
                                    <TableCell as="th" flex="2" mobileFlex="3">Billett type</TableCell>
                                    <TableCell as="th" flex="4" mobileFlex="7">Eies av bruker</TableCell>
                                    <TableCell as="th" flex="4" mobileHide>Kjøpt av bruker</TableCell>
                                    <TableCell as="th" flex="4" mobileHide>Seates av bruker</TableCell>
                                    <TableCell as="th" flex="2" mobileFlex="2">Sete</TableCell>
                                    <TableCell as="th" flex="3" mobileHide>Kjøpetid</TableCell>
                                    
                                    <TableCell as="th" center flex="0 24px" mobileHide title="Statusikon: Ikon vises dersom billetten har blitt sjekket inn"><IconContainer>...</IconContainer></TableCell>
                                    <TableCell as="th" center flex="0 24px" mobileHide title="Trykk for å åpne"><IconContainer>...</IconContainer></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    tickets.map((ticket) => {
                                        return (
                                            <SelectableTableRow title="Trykk for å åpne" onClick={e => {history.push(`/ticket/${ticket.ticket_id}`)}}>
                                                <TableCell consolas flex="1" mobileFlex="2">#{ ticket.ticket_id }</TableCell>
                                                <TableCell flex="2" mobileFlex="3">{ ticket.ticket_type.name }</TableCell>
                                                <TableCell flex="4" mobileFlex="7">{ User.getFullName(ticket.owner) }</TableCell>
                                                <TableCell flex="4" mobileHide>{ User.getFullName(ticket.buyer) }</TableCell>
                                                <TableCell flex="4" mobileHide>{ User.getFullName(ticket.seater) }</TableCell>
                                                <TableCell flex="2" mobileFlex="2">{ ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "" }</TableCell>
                                                <TableCell flex="3" mobileHide>{ new Date(ticket.created*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) }</TableCell>
                                                <TableCell flex="0 24px" mobileHide center><IconContainer hidden={!ticket.checked_in} color="#43a047"><FontAwesomeIcon icon={faCheck} title="Billetten er sjekket inn" /></IconContainer></TableCell>
                                                <TableCell flex="0 24px" mobileHide center><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
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
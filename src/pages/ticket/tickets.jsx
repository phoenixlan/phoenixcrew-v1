import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom';
import { getActiveStoreSessions, getEventTickets, getCurrentEvent, User, TicketType } from "@phoenixlan/phoenix.js";
import { Table, TableCell, TableHead, IconContainer, SelectableTableRow, TableRow, TableBody } from "../../components/table";
import { PageLoading } from "../../components/pageLoading";
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InputLabel, InputSelect } from "../../components/dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { BarElement, FlexBar } from "../../components/bar";

const SORTING_METHODS = {
    TICKET_ID: 1,
    TICKET_TYPE: 2,
    TICKET_OWNER: 3,
    TICKED_CHECKED_IN: 4
}

const SORTING_TYPES = {}
SORTING_TYPES[SORTING_METHODS.TICKET_ID] = (a, b) => a.ticket_id - b.ticket_id;
SORTING_TYPES[SORTING_METHODS.TICKET_TYPE] = (a, b) => a.ticket_type.name.localeCompare(b.ticket_type.name);
SORTING_TYPES[SORTING_METHODS.TICKET_OWNER] = (a, b) => a.owner.firstname.localeCompare(b.owner.firstname);
SORTING_TYPES[SORTING_METHODS.TICKED_CHECKED_IN] = (a, b) => b.checked_in - a.checked_in;

export const TicketList = () => {
    const [ tickets, setTickets ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const [ activeSortingMethod, setActiveSortingMethod] = useState(1);

    const [ ticketsProgressBar, setTicketsProgressBar ] = useState(undefined);
    const [ checkedinTicketsProgressBar, setCheckedinTicketsProgressBar] = useState(undefined);

    let history = useHistory();

    const reload = async () => {

        const event = await getCurrentEvent();
        
        const [ tickets, storeSessions, allTicketTypes ] = await Promise.all([
            getEventTickets(event.uuid),
            getActiveStoreSessions(),
            TicketType.getTicketTypes()
        ])

        setTickets(tickets);

        // Count all tickets which is held in store sessions
        let heldTickets = 0; 
        storeSessions.map((storeSession) => {
            storeSession.entries.map((entry) => {
                if(entry.ticket_type.seatable) {
                    heldTickets += entry.amount;
                }  
            })
        })

        // Logic to create progressbars for tickets and checked in tickets
        let ticketsProgressBar = [];
        let checkedinTicketsProgressBar = [];

        let availableTickets = event.max_participants - tickets.filter((ticket) => ticket.ticket_type.seatable == true).length - heldTickets; 

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
            width: ticketsNotCheckedinCount,
            fillOnEmpty: !ticketsCheckedinCount
        })
        setCheckedinTicketsProgressBar(checkedinTicketsProgressBar);

        setLoading(false);
    }

    // Ticket sorting
    let processedTicketList = tickets
        .sort(SORTING_TYPES[activeSortingMethod]);

    useEffect(() => {
        reload();
    }, []);

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
                        <InnerContainer flex="2" floattop>
                            <InputLabel small>Billettsortering:</InputLabel>
                            <InputSelect onChange={(e) => setActiveSortingMethod(e.target.value)}>
                                <option value={SORTING_METHODS.TICKET_ID}>Billett ID</option>
                                <option value={SORTING_METHODS.TICKET_TYPE}>Billett type</option>
                                <option value={SORTING_METHODS.TICKET_OWNER}>Billett eier</option>
                                <option value={SORTING_METHODS.TICKED_CHECKED_IN}>Innsjekket</option>
                            </InputSelect>
                        </InnerContainer>
                        <InnerContainer flex="1" mobileHide />
                        <InnerContainer flex="2" floattop>
                            Graf over billetter:
                            <FlexBar>
                                {ticketsProgressBar.map((object) => {
                                    return (<BarElement color={object.color} title={object.title} width={object.width} />)
                                })}
                            </FlexBar>
                        </InnerContainer>
                        <InnerContainer flex="2" floattop>
                            Graf over innsjekkede billetter:
                            <FlexBar>
                                {checkedinTicketsProgressBar.map((object) => {
                                    return (<BarElement color={object.color} title={object.title} width={object.width} fillOnEmpty={object.fillOnEmpty} />)
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
                                    processedTicketList.map((ticket) => {
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
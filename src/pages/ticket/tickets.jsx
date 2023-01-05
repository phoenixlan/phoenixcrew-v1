import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom';
import { getEventTickets, getCurrentEvent, User, Ticket } from "@phoenixlan/phoenix.js";
import { Table, Column, TableHeader, IconContainer, SelectableRow } from "../../components/table";
import { PageLoading } from "../../components/pageLoading";
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow } from "../../components/dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faUserCheck } from "@fortawesome/free-solid-svg-icons";

export const TicketList = () => {
    const [ tickets, setTickets ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ sortingMethodTicket, setSortingMethodTicket ] = useState(1);

    let history = useHistory();

    const reload = async () => {
        const event = await getCurrentEvent();
        const tickets = await getEventTickets(event.uuid);
        setTickets(tickets)
        setLoading(false)
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
                            Graf over billetter kommer...
                        </InnerContainer>
                    </InnerContainerRow>
                    
    
                    <InnerContainer>
                        <Table>
                            <TableHeader border>
                                <Column flex="1">ID</Column>
                                <Column flex="2">Billett type</Column>
                                <Column flex="4">Eies av bruker</Column>
                                <Column flex="4">Kjøpt av bruker</Column>
                                <Column flex="4">Seates av bruker</Column>
                                <Column flex="2">Seteplass</Column>
                                <Column flex="3">Kjøpetid</Column>
                                
                                <Column center flex="0 24px" title="Statusikon: Ikon vises dersom billetten har blitt sjekket inn"><IconContainer>...</IconContainer></Column>
                                <Column center flex="0 24px" title="Trykk for å åpne"><IconContainer>...</IconContainer></Column>
                            </TableHeader>

                            {
                                tickets.map((ticket) => {
                                    return (
                                        <SelectableRow title="Trykk for å åpne" onClick={e => {history.push(`/ticket/${ticket.ticket_id}`)}}>
                                            <Column consolas flex="1">#{ ticket.ticket_id }</Column>
                                            <Column flex="2">{ ticket.ticket_type.name }</Column>
                                            <Column flex="4">{ User.getFullName(ticket.owner) }</Column>
                                            <Column flex="4">{ User.getFullName(ticket.buyer) }</Column>
                                            <Column flex="4">{ User.getFullName(ticket.seater) }</Column>
                                            <Column flex="2">{ ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "" }</Column>
                                            <Column flex="3">{ new Date(ticket.created*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) }</Column>
                                            <Column flex="0 24px" center><IconContainer><FontAwesomeIcon icon={ticket.checkedin ? faUserCheck : null}/></IconContainer></Column>
                                            <Column flex="0 24px" center><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                                        </SelectableRow>
                                    )
                                })
                            }
                        </Table>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
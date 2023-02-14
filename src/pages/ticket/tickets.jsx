import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom';
import { getEventTickets, getCurrentEvent, User, Ticket } from "@phoenixlan/phoenix.js";
import { Table, TableCell, TableHead, IconContainer, SelectableTableRow, TableRow, TableBody } from "../../components/table";
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
                            <TableHead border>
                                <TableRow>
                                    <TableCell flex="1" mobileFlex="2">ID</TableCell>
                                    <TableCell flex="2" mobileFlex="3">Billett type</TableCell>
                                    <TableCell flex="4" mobileFlex="7">Eies av bruker</TableCell>
                                    <TableCell flex="4" mobileHide>Kjøpt av bruker</TableCell>
                                    <TableCell flex="4" mobileHide>Seates av bruker</TableCell>
                                    <TableCell flex="2" mobileFlex="2">Sete</TableCell>
                                    <TableCell flex="3" mobileHide>Kjøpetid</TableCell>
                                    
                                    <TableCell center flex="0 24px" mobileHide title="Statusikon: Ikon vises dersom billetten har blitt sjekket inn"><IconContainer>...</IconContainer></TableCell>
                                    <TableCell center flex="0 24px" mobileHide title="Trykk for å åpne"><IconContainer>...</IconContainer></TableCell>
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
                                                <TableCell flex="0 24px" mobileHide center><IconContainer><FontAwesomeIcon icon={ticket.checkedin ? faUserCheck : null}/></IconContainer></TableCell>
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
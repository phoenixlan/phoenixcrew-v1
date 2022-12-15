import React, { useState, useEffect } from "react"
import { Link, useHistory } from 'react-router-dom';
import { getEventTickets, getCurrentEvent, User, Ticket } from "@phoenixlan/phoenix.js";

import { Table, Row, Column, TableHeader, IconContainer, SelectableRow } from "../../components/table";

import Spinner from "react-svg-spinner";
import { PageLoading } from "../../components/pageLoading";
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InputCheckbox } from "../../components/dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faUserCheck } from "@fortawesome/free-solid-svg-icons";

export const TicketList = () => {
    const [ tickets, setTickets ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [visibleUUID, setVisibleUUID] = useState(false);

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
                    <InnerContainer>
                    </InnerContainer>
    
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
                            /*
                                tickets.map(ticket => {
                                return (<Row key={ticket.ticket_id}>
                                    <Column>{ticket.ticket_id}</Column>
                                    <Column><Link to={`/user/${ticket.owner.uuid}`}>{User.getFullName(ticket.owner)}</Link></Column>
                                    <Column><Link to={`/user/${ticket.buyer.uuid}`}>{User.getFullName(ticket.buyer)}</Link></Column>
                                    <Column>{ticket.seater ? (<Link to={`/user/${ticket.seater.uuid}`}>{User.getFullName(ticket.seater)}</Link>) : "Ingen"}</Column>
                                    <Column>{ticket.ticket_type.name}</Column>
                                    <Column>{(ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "Ingen")}</Column>
                                    <Column>{new Date(ticket.created*1000).toLocaleString()}</Column>
                                    <Column>{ticket.checked_in ? new Date(ticket.checked_in*1000).toLocaleString() : (<>
                                        <b>Nei</b>
                                        <button onClick={() => checkin(ticket.ticket_id)}>Sjekk inn</button>
                                    </>)}</Column>
                                </Row>)
                            })
                            */
                            
                            
                            }
                        </Table>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }

    return (<>
        <h1>Billetter(Dette eventet)</h1>
        {
            loading ? (<Spinner />) : (
                <Table>
                    <thead>
                        <Row>
                            <Column>ID</Column>
                            <Column>Eier</Column>
                            <Column>Opprinnelig kjøper</Column>
                            <Column>Seater</Column>
                            <Column>Type</Column>
                            <Column>Sete</Column>
                            <Column>Kjøpt</Column>
                            <Column>Sjekket inn?</Column>
                        </Row>
                    </thead>
                    <tbody>
                        {
                            tickets.map(ticket => {
                                return (<Row key={ticket.ticket_id}>
                                    <Column>{ticket.ticket_id}</Column>
                                    <Column><Link to={`/user/${ticket.owner.uuid}`}>{User.getFullName(ticket.owner)}</Link></Column>
                                    <Column><Link to={`/user/${ticket.buyer.uuid}`}>{User.getFullName(ticket.buyer)}</Link></Column>
                                    <Column>{ticket.seater ? (<Link to={`/user/${ticket.seater.uuid}`}>{User.getFullName(ticket.seater)}</Link>) : "Ingen"}</Column>
                                    <Column>{ticket.ticket_type.name}</Column>
                                    <Column>{(ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "Ingen")}</Column>
                                    <Column>{new Date(ticket.created*1000).toLocaleString()}</Column>
                                    <Column>{ticket.checked_in ? new Date(ticket.checked_in*1000).toLocaleString() : (<>
                                        <b>Nei</b>
                                        <button onClick={() => checkin(ticket.ticket_id)}>Sjekk inn</button>
                                    </>)}</Column>
                                </Row>)
                            })
                        }
                    </tbody>
                </Table>
            )
        }
        <p>{ tickets.length } billetter</p>
    </>)
}
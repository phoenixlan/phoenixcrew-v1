import React, { useState, useEffect } from "react"
import { Link } from 'react-router-dom';
import { getEventTickets, getCurrentEvent, User, Ticket } from "@phoenixlan/phoenix.js";

import { Table, Row, Column } from "../../components/table";

import Spinner from "react-svg-spinner";

export const TicketList = () => {
    const [ tickets, setTickets ] = useState([]);
    const [ loading, setLoading ] = useState(true);

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
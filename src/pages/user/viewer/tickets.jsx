import React, { useState, useEffect } from 'react';
import { User} from "@phoenixlan/phoenix.js";
import { Table, Column, TableHeader, SelectableRow, Row, IconContainer } from "../../../components/table";
import { PageLoading } from '../../../components/pageLoading';
import { InnerContainer, InnerContainerTitleS } from '../../../components/dashboard';

export const UserViewerTickets = ({ user }) => {
    const [ loading, setLoading ] = useState(false);
    const [ ownedTickets, setOwnedTickets ] = useState([]);
    const [ purchasedTickets, setPurchasedTickets ] = useState([]);
    const [ seatableTickets, setSeatableTickets] = useState([]);

    const reload = async () => {
        setLoading(true);
        const [ ownedTickets, purchasedTickets, seatableTickets ] = await Promise.all([
            User.getOwnedTickets(user.uuid),
            User.getPurchasedTickets(user.uuid),
            User.getSeatableTickets(user.uuid),
        ])

        setOwnedTickets(ownedTickets);
        setPurchasedTickets(purchasedTickets);
        setSeatableTickets(seatableTickets);

        setLoading(false);
    }

    useEffect(() => {
        reload();
    }, []);

    if(loading) {
        return (<PageLoading />)
    }
    return (
        <>
            <InnerContainer border extramargin>
                <InnerContainerTitleS>Følgende billetter har blitt kjøpt av brukeren</InnerContainerTitleS>
                <Table>
                    <TableHeader border>
                        <Column flex="1">ID</Column>
                        <Column flex="5">Arrangement</Column>
                        <Column flex="3">Eies av bruker</Column>
                        <Column flex="3">Seates av bruker</Column>
                        <Column flex="1">Seteplass</Column>
                    </TableHeader>

                    {
                        purchasedTickets.map(ticket => (
                            <SelectableRow>
                                <Column consolas flex="1">#{ ticket.ticket_id }</Column>
                                <Column flex="5">{ticket.event_uuid}</Column>
                                <Column flex="3">{ticket.owner.firstname} {ticket.seater.lastname}</Column>
                                <Column flex="3">{ticket.seater.firstname} {ticket.seater.lastname}</Column>
                                <Column flex="1">{ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "Ikke seatet"}</Column>
                            </SelectableRow>
                        ))
                    }
                </Table>
            </InnerContainer>

            <InnerContainer border extramargin>
                <InnerContainerTitleS>Følgende billetter eies av brukeren</InnerContainerTitleS>
                <Table>
                    <TableHeader border>
                        <Column flex="1">ID</Column>
                        <Column flex="5">Arrangement</Column>
                        <Column flex="3">Kjøpt av bruker</Column>
                        <Column flex="3">Seates av bruker</Column>
                        <Column flex="1">Seteplass</Column>
                    </TableHeader>

                    {
                        ownedTickets.map(ticket => (
                            <SelectableRow>
                                <Column consolas flex="1">#{ ticket.ticket_id }</Column>
                                <Column flex="5">{ticket.event_uuid}</Column>
                                <Column flex="3">{ticket.buyer.firstname} {ticket.buyer.lastname}</Column>
                                <Column flex="3">{ticket.seater.firstname} {ticket.seater.lastname}</Column>
                                <Column flex="1">{ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "Ikke seatet"}</Column>
                            </SelectableRow>
                        ))
                    }
                </Table>
            </InnerContainer>
        </>
    )
}
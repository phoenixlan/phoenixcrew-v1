import React, { useState, useEffect } from 'react';
import { User} from "@phoenixlan/phoenix.js";
import { Table, TableCell, TableHead, SelectableTableRow, Row, IconContainer } from "../../../components/table";
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
                    <TableHead border>
                        <TableCell flex="1">ID</TableCell>
                        <TableCell flex="5">Arrangement</TableCell>
                        <TableCell flex="3">Eies av bruker</TableCell>
                        <TableCell flex="3">Seates av bruker</TableCell>
                        <TableCell flex="1">Seteplass</TableCell>
                    </TableHead>

                    {
                        purchasedTickets.map(ticket => (
                            <SelectableTableRow>
                                <TableCell consolas flex="1">#{ ticket.ticket_id }</TableCell>
                                <TableCell flex="5">{ticket.event_uuid}</TableCell>
                                <TableCell flex="3">{ticket.owner.firstname} {ticket.seater.lastname}</TableCell>
                                <TableCell flex="3">{ticket.seater.firstname} {ticket.seater.lastname}</TableCell>
                                <TableCell flex="1">{ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "Ikke seatet"}</TableCell>
                            </SelectableTableRow>
                        ))
                    }
                </Table>
            </InnerContainer>

            <InnerContainer border extramargin>
                <InnerContainerTitleS>Følgende billetter eies av brukeren</InnerContainerTitleS>
                <Table>
                    <TableHead border>
                        <TableCell flex="1">ID</TableCell>
                        <TableCell flex="5">Arrangement</TableCell>
                        <TableCell flex="3">Kjøpt av bruker</TableCell>
                        <TableCell flex="3">Seates av bruker</TableCell>
                        <TableCell flex="1">Seteplass</TableCell>
                    </TableHead>

                    {
                        ownedTickets.map(ticket => (
                            <SelectableTableRow>
                                <TableCell consolas flex="1">#{ ticket.ticket_id }</TableCell>
                                <TableCell flex="5">{ticket.event_uuid}</TableCell>
                                <TableCell flex="3">{ticket.buyer.firstname} {ticket.buyer.lastname}</TableCell>
                                <TableCell flex="3">{ticket.seater.firstname} {ticket.seater.lastname}</TableCell>
                                <TableCell flex="1">{ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "Ikke seatet"}</TableCell>
                            </SelectableTableRow>
                        ))
                    }
                </Table>
            </InnerContainer>
        </>
    )
}
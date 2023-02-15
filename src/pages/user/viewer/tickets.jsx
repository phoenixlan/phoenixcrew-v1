import React, { useState, useEffect } from 'react';
import { User} from "@phoenixlan/phoenix.js";
import { Table, TableCell, TableHead, SelectableTableRow, Row, IconContainer, TableRow, TableBody } from "../../../components/table";
import { PageLoading } from '../../../components/pageLoading';
import { InnerContainer, InnerContainerTitle, InnerContainerTitleS } from '../../../components/dashboard';

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
            <InnerContainer extramargin>
                <InnerContainerTitle>Følgende billetter har blitt kjøpt av brukeren</InnerContainerTitle>
                <Table>
                    <TableHead border>
                        <TableRow>
                            <TableCell mobileFlex="1" flex="1">ID</TableCell>
                            <TableCell mobileFlex="3" flex="4">Arrangement</TableCell>
                            <TableCell mobileFlex="3" flex="3">Eies av bruker</TableCell>
                            <TableCell mobileHide flex="3">Seates av bruker</TableCell>
                            <TableCell mobileHide flex="1">Seteplass</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            purchasedTickets.map(ticket => (
                                <SelectableTableRow>
                                    <TableCell mobileFlex="1" consolas flex="1">#{ ticket.ticket_id }</TableCell>
                                    <TableCell mobileFlex="3" flex="4">{ticket.event.name}</TableCell>
                                    <TableCell mobileFlex="3" flex="3">{ticket.owner.firstname} {ticket.seater.lastname}</TableCell>
                                    <TableCell mobileHide flex="3">{ticket.seater.firstname} {ticket.seater.lastname}</TableCell>
                                    <TableCell mobileHide flex="1">{ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "Ikke seatet"}</TableCell>
                                </SelectableTableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </InnerContainer>
            <InnerContainer extramargin mobileHide />
            <InnerContainer extramargin>
                <InnerContainerTitle>Følgende billetter eies av brukeren</InnerContainerTitle>
                <Table>
                    <TableHead border>
                        <TableRow>
                            <TableCell mobileFlex="1" flex="1">ID</TableCell>
                            <TableCell mobileFlex="3" flex="4">Arrangement</TableCell>
                            <TableCell mobileFlex="3" flex="3">Kjøpt av bruker</TableCell>
                            <TableCell mobileHide flex="3">Seates av bruker</TableCell>
                            <TableCell mobileHide flex="1">Seteplass</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            ownedTickets.map(ticket => (
                                <SelectableTableRow>
                                    <TableCell mobileFlex="1" consolas flex="1">#{ ticket.ticket_id }</TableCell>
                                    <TableCell mobileFlex="3" flex="4">{ticket.event.name}</TableCell>
                                    <TableCell mobileFlex="3" flex="3">{ticket.buyer.firstname} {ticket.buyer.lastname}</TableCell>
                                    <TableCell mobileHide flex="3">{ticket.seater.firstname} {ticket.seater.lastname}</TableCell>
                                    <TableCell mobileHide flex="1">{ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "Ikke seatet"}</TableCell>
                                </SelectableTableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </InnerContainer>
        </>
    )
}
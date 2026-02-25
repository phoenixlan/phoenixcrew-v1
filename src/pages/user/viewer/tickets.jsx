import React from 'react';
import { Table, TableCell, TableHead, SelectableTableRow, TableRow, TableBody } from "../../../components/table";
import { PageLoading } from '../../../components/pageLoading';
import { InnerContainer, InnerContainerTitle } from '../../../components/dashboard';
import { useUserOwnedTickets, useUserPurchasedTickets } from '../../../hooks/useUser';

export const UserViewerTickets = ({ user }) => {
    const { data: ownedTickets = [], isLoading: ownedLoading } = useUserOwnedTickets(user.uuid);
    const { data: purchasedTickets = [], isLoading: purchasedLoading } = useUserPurchasedTickets(user.uuid);

    if(ownedLoading || purchasedLoading) {
        return (<PageLoading />)
    }
    return (
        <>
            <InnerContainer rowgap>
                <InnerContainer>
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

                <InnerContainer>
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
            </InnerContainer>
        </>
    )
}

import React from 'react';
import { useHistory } from 'react-router-dom';
import { Table, TableCell, TableHead, SelectableTableRow, TableRow, TableBody } from "../../../components/table";
import { PageLoading } from '../../../components/pageLoading';
import { InnerContainer, InnerContainerTitle } from '../../../components/dashboard';
import { Notice } from '../../../components/containers/notice';
import { useUserPayments } from '../../../hooks/useUserPayments';
import { paymentStateLabel } from '../../../utils/payment';

export const UserViewerPayments = ({ user }) => {
    const history = useHistory();
    const { data: payments = [], isLoading, error } = useUserPayments(user.uuid);

    if(isLoading) {
        return (<PageLoading />)
    }
    return (
        <>
            <InnerContainer>
                <InnerContainerTitle>Følgende betalinger har blitt gjort av brukeren</InnerContainerTitle>
                <Notice type="error" visible={!!error}>
                    Det oppsto en feil ved henting av betalinger.
                </Notice>
                <Table>
                    <TableHead border>
                        <TableRow>
                            <TableCell mobileFlex="2" flex="2">Opprettet</TableCell>
                            <TableCell mobileHide flex="3">Arrangement</TableCell>
                            <TableCell mobileHide flex="2">Leverandør</TableCell>
                            <TableCell mobileFlex="2" flex="2">Status</TableCell>
                            <TableCell mobileFlex="1" flex="1">Pris</TableCell>
                            <TableCell mobileHide flex="1">Refundert</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            payments.map(payment => (
                                <SelectableTableRow key={payment.uuid} onClick={() => history.push(`/payment/${payment.uuid}`)}>
                                    <TableCell mobileFlex="2" flex="2">{ new Date(payment.created*1000).toLocaleString() }</TableCell>
                                    <TableCell mobileHide flex="3">{payment.tickets.length > 0 ? payment.tickets[0].event.name : "–"}</TableCell>
                                    <TableCell mobileHide flex="2">{payment.provider}</TableCell>
                                    <TableCell mobileFlex="2" flex="2">{paymentStateLabel[payment.state] ?? payment.state}</TableCell>
                                    <TableCell mobileFlex="1" flex="1">{payment.price} kr</TableCell>
                                    <TableCell mobileHide flex="1">{payment.refunded_amount} kr</TableCell>
                                </SelectableTableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </InnerContainer>
        </>
    )
}

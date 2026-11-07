import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar, faUser } from '@fortawesome/free-regular-svg-icons';
import { faCode, faDollarSign, faGear, faRotateLeft } from "@fortawesome/free-solid-svg-icons"

import { Table, TableBody, TableCell, TableHead, TableRow } from "../../components/table";
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInnerText, CardContainerText, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputElement, InputLabel, PanelButton, SpanLink } from "../../components/dashboard"
import { PageLoading } from "../../components/pageLoading";
import { Notice } from "../../components/containers/notice";

import { usePayment } from "../../hooks/usePayment";
import { useUser } from "../../hooks/useUser";
import { useRefundPaymentMutation } from "../../hooks/useRefundPaymentMutation";
import { getStateIcon, getTicketRefundBlocker, isRefundable, paymentStateLabel } from "../../utils/payment";

export const ViewPayment = () => {
    const { uuid } = useParams();
    const history = useHistory();

    const { data: payment, isLoading, error } = usePayment(uuid);
    const { data: paymentUser } = useUser(payment?.user_uuid);
    const refundMutation = useRefundPaymentMutation(uuid);

    const [ selectedTicketIds, setSelectedTicketIds ] = useState([]);

    const toggleTicket = (ticketId) => {
        setSelectedTicketIds(selectedTicketIds.includes(ticketId) ? selectedTicketIds.filter(id => id !== ticketId) : [...selectedTicketIds, ticketId]);
    }

    const selectedTickets = (payment?.tickets ?? []).filter(ticket => selectedTicketIds.includes(ticket.ticket_id));
    const selectedAmount = selectedTickets.reduce((sum, ticket) => sum + ticket.ticket_type.price, 0);

    const refund = () => {
        if(window.confirm("Er du sikker på at du vil refundere " + selectedTickets.length + " billett(er) for " + selectedAmount + " kr?")) {
            refundMutation.mutate(selectedTicketIds, {
                onSuccess: () => setSelectedTicketIds([]),
            });
        }
    }

    if(isLoading) {
        return (<PageLoading />)
    }

    if(error) {
        return (
            <>
                <DashboardHeader border>
                    <DashboardTitle>
                        Betaling
                    </DashboardTitle>
                </DashboardHeader>

                <DashboardContent>
                    <Notice type="error" visible>
                        Det oppsto en feil ved henting av informasjon for denne betalingen.<br />
                        {error?.message}
                    </Notice>
                </DashboardContent>
            </>
        )
    }

    return (
        <>
            <DashboardHeader>
                <DashboardTitle>
                    Betaling
                </DashboardTitle>
                <DashboardSubtitle>
                    {payment.uuid}
                </DashboardSubtitle>
            </DashboardHeader>

            <DashboardContent>
                <InnerContainer>
                    <InnerContainerTitle>Betalingsinformasjon</InnerContainerTitle>
                    <CardContainer>
                        <CardContainerIcon>
                            <CardContainerInnerIcon>
                                <FontAwesomeIcon icon={faGear} />
                            </CardContainerInnerIcon>
                        </CardContainerIcon>
                        <CardContainerText>
                            <InputLabel small>Betalingsleverandør</InputLabel>
                            <CardContainerInnerText>{payment.provider}</CardContainerInnerText>
                        </CardContainerText>
                    </CardContainer>

                    <CardContainer>
                        <CardContainerIcon>
                            <CardContainerInnerIcon>
                                <FontAwesomeIcon icon={getStateIcon(payment.state).icon} color={getStateIcon(payment.state).color} />
                            </CardContainerInnerIcon>
                        </CardContainerIcon>
                        <CardContainerText>
                            <InputLabel small>Status</InputLabel>
                            <CardContainerInnerText>{paymentStateLabel[payment.state] ?? payment.state}</CardContainerInnerText>
                        </CardContainerText>
                    </CardContainer>

                    <CardContainer>
                        <CardContainerIcon>
                            <CardContainerInnerIcon>
                                <FontAwesomeIcon icon={faDollarSign} />
                            </CardContainerInnerIcon>
                        </CardContainerIcon>
                        <CardContainerText>
                            <InputLabel small>Pris</InputLabel>
                            <CardContainerInnerText>{payment.price} kr</CardContainerInnerText>
                        </CardContainerText>
                    </CardContainer>

                    <CardContainer>
                        <CardContainerIcon>
                            <CardContainerInnerIcon>
                                <FontAwesomeIcon icon={faRotateLeft} />
                            </CardContainerInnerIcon>
                        </CardContainerIcon>
                        <CardContainerText>
                            <InputLabel small>Refundert beløp</InputLabel>
                            <CardContainerInnerText>{payment.refunded_amount} kr</CardContainerInnerText>
                        </CardContainerText>
                    </CardContainer>

                    <CardContainer>
                        <CardContainerIcon>
                            <CardContainerInnerIcon>
                                <FontAwesomeIcon icon={faCalendar} />
                            </CardContainerInnerIcon>
                        </CardContainerIcon>
                        <CardContainerText>
                            <InputLabel small>Opprettet</InputLabel>
                            <CardContainerInnerText>{ new Date(payment.created*1000).toLocaleString() }</CardContainerInnerText>
                        </CardContainerText>
                    </CardContainer>

                    <CardContainer>
                        <CardContainerIcon>
                            <CardContainerInnerIcon>
                                <FontAwesomeIcon icon={faCode} />
                            </CardContainerInnerIcon>
                        </CardContainerIcon>
                        <CardContainerText>
                            <InputLabel small>Butikkøkt-ID</InputLabel>
                            <CardContainerInnerText console>{payment.store_session_uuid}</CardContainerInnerText>
                        </CardContainerText>
                    </CardContainer>

                    {paymentUser && (
                        <CardContainer>
                            <CardContainerIcon>
                                <CardContainerInnerIcon>
                                    <FontAwesomeIcon icon={faUser} />
                                </CardContainerInnerIcon>
                            </CardContainerIcon>
                            <CardContainerText>
                                <InputLabel small>Betaler</InputLabel>
                                <CardContainerInnerText><SpanLink onClick={() => history.push(`/user/${paymentUser.uuid}`)}>{paymentUser.lastname}, {paymentUser.firstname}</SpanLink></CardContainerInnerText>
                            </CardContainerText>
                        </CardContainer>
                    )}
                </InnerContainer>

                <InnerContainer>
                    <InnerContainerTitle>Billetter i betalingen</InnerContainerTitle>
                    <Notice type="info" visible={!isRefundable(payment)}>
                        Betalingen kan ikke refunderes i nåværende status.
                    </Notice>
                    <Notice type="error" visible={refundMutation.isError}>
                        {refundMutation.error?.message}
                    </Notice>
                    <Notice type="success" visible={refundMutation.isSuccess}>
                        Refusjonen er gjennomført.
                    </Notice>
                    <Table>
                        <TableHead border>
                            <TableRow>
                                <TableCell as="th" center flex="0 24px"></TableCell>
                                <TableCell as="th" flex="1">ID</TableCell>
                                <TableCell as="th" flex="3">Billettype</TableCell>
                                <TableCell as="th" mobileHide flex="1">Pris</TableCell>
                                <TableCell as="th" mobileHide flex="3">Eier</TableCell>
                                <TableCell as="th" flex="3">Kan ikke refunderes</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payment.tickets.map(ticket => {
                                const blocker = getTicketRefundBlocker(payment, ticket);
                                return (
                                    <TableRow key={ticket.ticket_id} active={!!blocker}>
                                        <TableCell center flex="0 24px">
                                            <InputElement type="checkbox" checked={selectedTicketIds.includes(ticket.ticket_id)} onChange={() => toggleTicket(ticket.ticket_id)} disabled={!!blocker || !isRefundable(payment)} />
                                        </TableCell>
                                        <TableCell consolas flex="1"><SpanLink onClick={() => history.push(`/brand/${ticket.event.event_brand_uuid}/ticket/${ticket.ticket_id}`)}>#{ticket.ticket_id}</SpanLink></TableCell>
                                        <TableCell flex="3">{ticket.ticket_type.name}</TableCell>
                                        <TableCell mobileHide flex="1">{ticket.ticket_type.price} kr</TableCell>
                                        <TableCell mobileHide flex="3">{ticket.owner.firstname} {ticket.owner.lastname}</TableCell>
                                        <TableCell flex="3">{blocker ?? ""}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    {isRefundable(payment) && (
                        <InnerContainerRow>
                            <PanelButton onClick={refund} disabled={selectedTicketIds.length === 0 || refundMutation.isLoading} icon={faRotateLeft}>Refunder valgte billetter ({selectedAmount} kr)</PanelButton>
                        </InnerContainerRow>
                    )}
                </InnerContainer>
            </DashboardContent>
        </>
    )
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar, faUser } from '@fortawesome/free-regular-svg-icons';
import { faCircleCheck, faCode, faDollarSign, faGear, faHourglass, faXmark } from "@fortawesome/free-solid-svg-icons"

import { SelectableTableRow, Table, TableBody, TableCell, TableHead, TableRow } from "../../../components/table";
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInnerText, CardContainerText, InnerContainer, InnerContainerTitle, InputLabel, SpanLink } from "../../../components/dashboard"
import { PageLoading } from "../../../components/pageLoading";
import { Notice } from "../../../components/containers/notice";
import { useHistory } from "react-router-dom";

import { usePayment } from "../../../hooks/usePayment";
import { useUser } from "../../../hooks/useUser";

const PaymentState = {
    created: "PaymentState.created",
    initiated: "PaymentState.initiated",
    paid: "PaymentState.paid",
    failed: "PaymentState.failed",
    tickets_minted: "PaymentState.tickets_minted",
};

const paymentStateLabel = {
    [PaymentState.created]: "Opprettet",
    [PaymentState.initiated]: "Startet",
    [PaymentState.paid]: "Betalt",
    [PaymentState.failed]: "Feilet",
    [PaymentState.tickets_minted]: "Fullført",
};

const getStateIcon = (state) => {
    if(state === PaymentState.tickets_minted) return { icon: faCircleCheck, color: "#388e3c" };
    if(state === PaymentState.failed) return { icon: faXmark, color: "#c2185b" };
    return { icon: faHourglass, color: "#f57c00" };
};

export const PaymentInformation = ({data}) => {

    const history = useHistory();
    const { data: payment, isLoading, error } = usePayment(data.ticket.payment_uuid);
    const { data: paymentUser } = useUser(payment?.user_uuid);

    const otherTickets = (payment?.tickets ?? []).filter(t => t.ticket_id !== data.ticket.ticket_id);

    if(!data.ticket.payment_uuid) {
        return (
            <InnerContainer>
                <Notice type="info" visible>
                    Denne billetten har ingen tilknyttet betaling.
                </Notice>
            </InnerContainer>
        )
    }

    if(isLoading) {
        return (<PageLoading />)
    }

    if(error) {
        return (
            <InnerContainer>
                <Notice type="error" visible>
                    Det oppsto en feil ved henting av betalingsinformasjon.
                </Notice>
            </InnerContainer>
        )
    }

    return (
        <>
        <InnerContainer>
            <InnerContainerTitle>Betalingsinformasjon</InnerContainerTitle>
            <CardContainer>
                <CardContainerIcon>
                    <CardContainerInnerIcon>
                        <FontAwesomeIcon icon={faCode} />
                    </CardContainerInnerIcon>
                </CardContainerIcon>
                <CardContainerText>
                    <InputLabel small>Betalings-ID</InputLabel>
                    <CardContainerInnerText console>{payment.uuid}</CardContainerInnerText>
                </CardContainerText>
            </CardContainer>

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
                        <CardContainerInnerText><SpanLink onClick={() => history.push(`/user/${paymentUser.uuid}`)}>{paymentUser.firstname}, {paymentUser.lastname}</SpanLink></CardContainerInnerText>
                    </CardContainerText>
                </CardContainer>
            )}
        </InnerContainer>

        {otherTickets.length > 0 && (
            <InnerContainer>
                <InnerContainerTitle>Andre billetter i samme betaling</InnerContainerTitle>
                <Table>
                    <TableHead border>
                        <TableRow>
                            <TableCell flex="1">ID</TableCell>
                            <TableCell flex="3">Billettype</TableCell>
                            <TableCell flex="2">Arrangement</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {otherTickets.map(ticket => (
                            <SelectableTableRow key={ticket.ticket_id} onClick={() => history.push(`/ticket/${ticket.ticket_id}`)}>
                                <TableCell consolas flex="1">#{ticket.ticket_id}</TableCell>
                                <TableCell flex="3">{ticket.ticket_type.name}</TableCell>
                                <TableCell flex="2">{ticket.event.name}</TableCell>
                            </SelectableTableRow>
                        ))}
                    </TableBody>
                </Table>
            </InnerContainer>
        )}
        </>
    )
}

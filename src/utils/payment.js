import { faCircleCheck, faHourglass, faRotateLeft, faXmark } from "@fortawesome/free-solid-svg-icons";

export const PaymentState = {
    created: "PaymentState.created",
    initiated: "PaymentState.initiated",
    paid: "PaymentState.paid",
    failed: "PaymentState.failed",
    tickets_minted: "PaymentState.tickets_minted",
    partially_refunded: "PaymentState.partially_refunded",
    refunded: "PaymentState.refunded",
};

export const paymentStateLabel = {
    [PaymentState.created]: "Opprettet",
    [PaymentState.initiated]: "Startet",
    [PaymentState.paid]: "Betalt",
    [PaymentState.failed]: "Feilet",
    [PaymentState.tickets_minted]: "Fullført",
    [PaymentState.partially_refunded]: "Delvis refundert",
    [PaymentState.refunded]: "Refundert",
};

export const getStateIcon = (state) => {
    if(state === PaymentState.tickets_minted) return { icon: faCircleCheck, color: "#388e3c" };
    if(state === PaymentState.failed) return { icon: faXmark, color: "#c2185b" };
    if(state === PaymentState.partially_refunded) return { icon: faRotateLeft, color: "#f57c00" };
    if(state === PaymentState.refunded) return { icon: faRotateLeft, color: "#c2185b" };
    return { icon: faHourglass, color: "#f57c00" };
};

export const isRefundable = (payment) => [PaymentState.tickets_minted, PaymentState.partially_refunded].includes(payment.state);

// Mirrors the API's refund rules, except voucher tickets which the API reports on refund
export const getTicketRefundBlocker = (payment, ticket) => {
    if(ticket.checked_in) return "Sjekket inn";
    if(!ticket.ticket_type.refundable) return "Ikke refunderbar billettype";
    if(ticket.owner.uuid !== payment.user_uuid) return "Eies ikke av kjøper";
    return null;
};

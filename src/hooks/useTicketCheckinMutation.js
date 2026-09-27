import { useMutation } from "@tanstack/react-query";
import { Ticket } from "@phoenixlan/phoenix.js";

export const useTicketCheckinMutation = () => {
    return useMutation({
        mutationFn: (ticketId) => Ticket.checkInTicket(ticketId),
    });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ticket } from "@phoenixlan/phoenix.js";

import { eventTicketsQueryKey } from "./useEventTickets";

export const useTicketCreateMutation = (eventUuid) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userUuid, ticketTypeUuid }) => Ticket.createTicket(eventUuid, userUuid, ticketTypeUuid),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: eventTicketsQueryKey });
        },
    });
};

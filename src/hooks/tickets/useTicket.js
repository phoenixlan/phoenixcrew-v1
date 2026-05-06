import { useQuery } from "@tanstack/react-query";
import { Ticket } from "@phoenixlan/phoenix.js";

export const useTicket = (ticketId) => {
    return useQuery({
        queryKey: ["ticket", ticketId],
        queryFn: () => Ticket.getTicket(ticketId),
        enabled: !!ticketId,
    });
};

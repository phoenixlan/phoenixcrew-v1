import { useQuery } from "@tanstack/react-query";
import { Ticket } from "@phoenixlan/phoenix.js";

export const useTicketTransferLog = (ticketId) => {
    return useQuery({
        queryKey: ["ticketTransferLog", ticketId],
        queryFn: () => Ticket.getTransferLog(ticketId),
        enabled: !!ticketId,
    });
};

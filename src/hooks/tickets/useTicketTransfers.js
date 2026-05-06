import { useQuery } from "@tanstack/react-query";
import { Event } from "@phoenixlan/phoenix.js";

export const useTicketTransfers = () => {
    return useQuery({
        queryKey: ["ticketTransfers"],
        queryFn: () => Event.getTicketTransfers(),
        refetchInterval: 5000,
    });
};

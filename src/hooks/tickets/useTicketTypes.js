import { useQuery } from "@tanstack/react-query";
import { TicketType } from "@phoenixlan/phoenix.js";

export const ticketTypesQueryKey = ["ticketTypes"];

export const useTicketTypes = () => {
    return useQuery({
        queryKey: ticketTypesQueryKey,
        queryFn: () => TicketType.getTicketTypes(),
    });
};

import { useQuery } from "@tanstack/react-query";
import { getEventTickets } from "@phoenixlan/phoenix.js";

export const eventTicketsQueryKey = ["eventTickets"];

export const useEventTickets = (eventUuid) => {
    return useQuery({
        queryKey: [...eventTicketsQueryKey, eventUuid],
        queryFn: () => getEventTickets(eventUuid),
        enabled: !!eventUuid,
    });
};

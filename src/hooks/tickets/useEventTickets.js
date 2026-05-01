import { useQuery } from "@tanstack/react-query";
import { getEventTickets } from "@phoenixlan/phoenix.js";

export const useEventTickets = (eventUuid) => {
    return useQuery({
        queryKey: ["eventTickets", eventUuid],
        queryFn: () => getEventTickets(eventUuid),
        enabled: !!eventUuid,
    });
};

import { useQuery } from "@tanstack/react-query";
import { getEventTicketTypes } from "@phoenixlan/phoenix.js";

export const useEventTicketTypes = (eventUuid) => {
    return useQuery({
        queryKey: ["eventTicketTypes", eventUuid],
        queryFn: () => getEventTicketTypes(eventUuid),
        enabled: !!eventUuid,
    });
};

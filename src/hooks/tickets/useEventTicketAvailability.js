import { useQuery } from "@tanstack/react-query";
import { getEventTicketAvailability } from "@phoenixlan/phoenix.js";

export const eventTicketAvailabilityQueryKey = ["eventTicketAvailability"];

export const useEventTicketAvailability = (eventUuid) => {
    return useQuery({
        queryKey: [...eventTicketAvailabilityQueryKey, eventUuid],
        queryFn: () => getEventTicketAvailability(eventUuid),
        enabled: !!eventUuid,
    });
};

import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@phoenixlan/phoenix.js";

export const eventsQueryKey = ["events"];

export const useEvents = (brandUuid) => {
    return useQuery({
        queryKey: eventsQueryKey,
        queryFn: () => getEvents(),
        select: events => brandUuid
            ? events.filter(event => event.event_brand_uuid === brandUuid)
            : events,
    });
};

import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@phoenixlan/phoenix.js";

export const eventsQueryKey = brandUuid => ["events", brandUuid];

export const useEvents = (brandUuid) => {
    return useQuery({
        queryKey: eventsQueryKey(brandUuid),
        queryFn: () => getEvents(brandUuid),
        select: events => brandUuid
            ? events.filter(event => event.event_brand_uuid === brandUuid)
            : events,
    });
};

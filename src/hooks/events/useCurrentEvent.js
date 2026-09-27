import { useQuery } from "@tanstack/react-query";
import { getCurrentEvent } from "@phoenixlan/phoenix.js";

export const currentEventQueryKey = brandUuid => ["currentEvent", brandUuid];

export const useCurrentEvent = (brandUuid) => {
    return useQuery({
        queryKey: currentEventQueryKey(brandUuid),
        queryFn: () => getCurrentEvent(brandUuid),
        enabled: !!brandUuid,
    });
};

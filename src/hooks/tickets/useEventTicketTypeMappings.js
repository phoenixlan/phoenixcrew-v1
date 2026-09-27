import { useQuery } from "@tanstack/react-query";
import { getEventTicketTypeMappings } from "@phoenixlan/phoenix.js";

export const eventTicketTypeMappingsQueryKey = ["eventTicketTypeMappings"];

export const useEventTicketTypeMappings = (eventUuid) => {
    return useQuery({
        queryKey: [...eventTicketTypeMappingsQueryKey, eventUuid],
        queryFn: () => getEventTicketTypeMappings(eventUuid),
        enabled: !!eventUuid,
    });
};

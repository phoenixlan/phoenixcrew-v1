import { useQuery } from "@tanstack/react-query";
import { TicketType } from "@phoenixlan/phoenix.js";

export const ticketTypesQueryKey = ["ticketTypes"];

export const useTicketTypes = (eventBrandUuid) => {
    return useQuery({
        queryKey: [...ticketTypesQueryKey, eventBrandUuid],
        queryFn: () => TicketType.getEventBrandTicketTypes(eventBrandUuid),
        enabled: !!eventBrandUuid,
    });
};

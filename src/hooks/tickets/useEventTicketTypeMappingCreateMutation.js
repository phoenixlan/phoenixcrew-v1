import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEventTicketTypeMapping } from "@phoenixlan/phoenix.js";

import { eventTicketTypeMappingsQueryKey } from "./useEventTicketTypeMappings";
import { eventTicketAvailabilityQueryKey } from "./useEventTicketAvailability";

export const useEventTicketTypeMappingCreateMutation = (eventUuid) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (mapping) => createEventTicketTypeMapping(eventUuid, mapping),
        onSuccess: () => Promise.all([
            queryClient.invalidateQueries({ queryKey: eventTicketTypeMappingsQueryKey }),
            queryClient.invalidateQueries({ queryKey: eventTicketAvailabilityQueryKey }),
        ]),
    });
};

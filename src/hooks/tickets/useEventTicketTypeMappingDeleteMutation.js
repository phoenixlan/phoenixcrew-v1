import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEventTicketTypeMapping } from "@phoenixlan/phoenix.js";

import { eventTicketTypeMappingsQueryKey } from "./useEventTicketTypeMappings";
import { eventTicketAvailabilityQueryKey } from "./useEventTicketAvailability";

export const useEventTicketTypeMappingDeleteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (mappingUuid) => deleteEventTicketTypeMapping(mappingUuid),
        onSuccess: () => Promise.all([
            queryClient.invalidateQueries({ queryKey: eventTicketTypeMappingsQueryKey }),
            queryClient.invalidateQueries({ queryKey: eventTicketAvailabilityQueryKey }),
        ]),
    });
};

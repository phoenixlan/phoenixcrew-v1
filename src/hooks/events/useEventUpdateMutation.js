import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEvent } from "@phoenixlan/phoenix.js";

import { currentEventQueryKey } from "./useCurrentEvent";
import { eventsQueryKey } from "./useEvents";
import { eventTicketAvailabilityQueryKey } from "../tickets/useEventTicketAvailability";

export const useEventUpdateMutation = (event) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: changes => updateEvent(event.uuid, changes),
        onSuccess: () => Promise.all([
            queryClient.invalidateQueries({ queryKey: eventsQueryKey }),
            queryClient.invalidateQueries({ queryKey: currentEventQueryKey(event.event_brand_uuid) }),
            queryClient.invalidateQueries({ queryKey: eventTicketAvailabilityQueryKey }),
        ]),
    });
};

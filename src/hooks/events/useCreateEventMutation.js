import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "@phoenixlan/phoenix.js";

import { currentEventQueryKey } from "./useCurrentEvent";
import { eventsQueryKey } from "./useEvents";

export const useCreateEventMutation = (brandUuid) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: event => createEvent(brandUuid, event),
        onSuccess: () => Promise.all([
            queryClient.invalidateQueries({ queryKey: eventsQueryKey }),
            queryClient.invalidateQueries({ queryKey: currentEventQueryKey(brandUuid) }),
        ]),
    });
};

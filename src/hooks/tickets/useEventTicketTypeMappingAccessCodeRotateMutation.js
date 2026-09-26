import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rotateEventTicketTypeMappingAccessCode } from "@phoenixlan/phoenix.js";

import { eventTicketTypeMappingsQueryKey } from "./useEventTicketTypeMappings";

export const useEventTicketTypeMappingAccessCodeRotateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (mappingUuid) => rotateEventTicketTypeMappingAccessCode(mappingUuid),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: eventTicketTypeMappingsQueryKey }),
    });
};

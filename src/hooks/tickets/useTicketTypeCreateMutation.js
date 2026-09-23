import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TicketType } from "@phoenixlan/phoenix.js";

import { ticketTypesQueryKey } from "./useTicketTypes";

export const useTicketTypeCreateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ eventBrandUuid, ticketType }) => TicketType.createTicketType(eventBrandUuid, ticketType),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ticketTypesQueryKey });
        },
    });
};

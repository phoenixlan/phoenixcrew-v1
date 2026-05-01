import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TicketVoucher } from "@phoenixlan/phoenix.js";

export const useTicketVoucherCreateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userUuid, ticketTypeUuid, eventUuid }) =>
            TicketVoucher.createTicketVoucher(userUuid, ticketTypeUuid, eventUuid),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ticketVouchers"] });
        },
    });
};

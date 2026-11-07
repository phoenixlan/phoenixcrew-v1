import { useMutation, useQueryClient } from "@tanstack/react-query";
import { refundPayment } from "@phoenixlan/phoenix.js";

import { userPaymentsQueryKey } from "./useUserPayments";

export const useRefundPaymentMutation = (paymentUuid) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ticketIds) => refundPayment(paymentUuid, ticketIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payment", paymentUuid] });
            queryClient.invalidateQueries({ queryKey: userPaymentsQueryKey });
        },
    });
};

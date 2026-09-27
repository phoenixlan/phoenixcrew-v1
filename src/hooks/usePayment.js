import { useQuery } from "@tanstack/react-query";
import { poll } from "@phoenixlan/phoenix.js";

export const usePayment = (paymentUuid) => {
    return useQuery({
        queryKey: ["payment", paymentUuid],
        queryFn: () => poll(paymentUuid),
        enabled: !!paymentUuid,
    });
};

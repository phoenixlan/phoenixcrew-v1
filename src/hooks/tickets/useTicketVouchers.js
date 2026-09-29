import { useQuery } from "@tanstack/react-query";
import { TicketVoucher } from "@phoenixlan/phoenix.js";

export const ticketVouchersQueryKey = ["ticketVouchers"];

export const useTicketVouchers = (eventBrandUuid) => {
    return useQuery({
        queryKey: [...ticketVouchersQueryKey, eventBrandUuid],
        queryFn: () => TicketVoucher.getEventBrandTicketVouchers(eventBrandUuid),
        enabled: !!eventBrandUuid,
    });
};

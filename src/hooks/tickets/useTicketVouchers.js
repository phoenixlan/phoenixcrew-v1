import { useQuery } from "@tanstack/react-query";
import { TicketVoucher } from "@phoenixlan/phoenix.js";

export const ticketVouchersQueryKey = ["ticketVouchers"];

export const useTicketVouchers = () => {
    return useQuery({
        queryKey: ticketVouchersQueryKey,
        queryFn: () => TicketVoucher.getAllTicketVouchers(),
    });
};

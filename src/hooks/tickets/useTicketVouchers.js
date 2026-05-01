import { useQuery } from "@tanstack/react-query";
import { TicketVoucher } from "@phoenixlan/phoenix.js";

export const useTicketVouchers = () => {
    return useQuery({
        queryKey: ["ticketVouchers"],
        queryFn: () => TicketVoucher.getAllTicketVouchers(),
    });
};

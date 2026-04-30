import { useQuery } from "@tanstack/react-query";
import { Statistics } from "@phoenixlan/phoenix.js";

export const useTicketSaleData = (showFree) => {
    return useQuery({
        queryKey: ["ticketSaleData", showFree],
        queryFn: () => Statistics.getTicketSaleData(showFree),
    });
};

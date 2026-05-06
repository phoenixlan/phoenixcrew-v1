import { useQuery } from "@tanstack/react-query";
import { TicketType } from "@phoenixlan/phoenix.js";

export const useTicketTypes = () => {
    return useQuery({
        queryKey: ["ticketTypes"],
        queryFn: () => TicketType.getTicketTypes(),
    });
};

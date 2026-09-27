import { useQuery } from "@tanstack/react-query";
import { EventBrand } from "@phoenixlan/phoenix.js";

export const useTicketSaleData = (event_brand_uuid, showFree) => {
    return useQuery({
        queryKey: ["ticketSaleData", event_brand_uuid, showFree],
        queryFn: () => EventBrand.Statistics.getTicketSaleData(event_brand_uuid, showFree),
        enabled: !!event_brand_uuid,
    });
};

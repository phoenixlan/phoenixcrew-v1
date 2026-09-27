import { useQuery } from "@tanstack/react-query";
import { EventBrand } from "@phoenixlan/phoenix.js";

export const useUserbaseStatistics = (event_brand_uuid) => {
    return useQuery({
        queryKey: ["userbaseStatistics", event_brand_uuid],
        queryFn: () => EventBrand.Statistics.getUserbaseStatistics(event_brand_uuid),
        enabled: !!event_brand_uuid,
    });
};

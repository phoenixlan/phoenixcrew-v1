import { useQuery } from "@tanstack/react-query";
import { EventBrand } from "@phoenixlan/phoenix.js";

export const useAgeDistributionStats = (event_brand_uuid) => {
    return useQuery({
        queryKey: ["ageDistributionStats", event_brand_uuid],
        queryFn: () => EventBrand.Statistics.getAgeDistributionStats(event_brand_uuid),
        enabled: !!event_brand_uuid,
    });
};

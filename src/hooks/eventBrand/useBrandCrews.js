import { useQuery } from "@tanstack/react-query";
import { EventBrand } from "@phoenixlan/phoenix.js";

export const eventBrandCrewQueryKey = "event_brand_crew";

export const useBrandCrews = (brand_uuid) => {
    return useQuery({
        queryKey: [eventBrandCrewQueryKey, brand_uuid],
        queryFn: async () => EventBrand.getCrews(brand_uuid),
        enabled: !!brand_uuid
    });
};

import { useQuery } from "@tanstack/react-query";
import { EventBrand } from "@phoenixlan/phoenix.js";

export const useBrandPositions = (brand_uuid) => {
    return useQuery({
        queryKey: ["event_brand_positions", brand_uuid],
        queryFn: () => EventBrand.getPositions(brand_uuid),
        enabled: !!brand_uuid
    });
};

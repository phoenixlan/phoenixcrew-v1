
import { useQuery } from "@tanstack/react-query";
import { EventBrand, Crew } from "@phoenixlan/phoenix.js";

export const eventBrandCrewQueryKey = "event_brand_crew";

export const useBrandFullCrews = (brand_uuid) => {
    return useQuery({
        queryKey: [eventBrandCrewQueryKey, brand_uuid],
        queryFn: async () => { 
            const crews = await EventBrand.getCrews(brand_uuid) 

            return await Promise.all(crews.map(async (crew) => { return await Crew.getCrew(crew.uuid) }))
        },
        enabled: !!brand_uuid
    });
};

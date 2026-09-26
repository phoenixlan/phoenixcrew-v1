import { useQuery } from "@tanstack/react-query";
import { Seatmap } from "@phoenixlan/phoenix.js";

export const brandSeatmapsQueryKey = brandUuid => ["brandSeatmaps", brandUuid];

export const useBrandSeatmaps = (brandUuid) => {
    return useQuery({
        queryKey: brandSeatmapsQueryKey(brandUuid),
        queryFn: () => Seatmap.getBrandSeatmaps(brandUuid),
        enabled: !!brandUuid,
    });
};

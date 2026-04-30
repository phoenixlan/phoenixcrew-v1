import { useQuery } from "@tanstack/react-query";
import { Statistics } from "@phoenixlan/phoenix.js";

export const useAgeDistributionStats = () => {
    return useQuery({
        queryKey: ["ageDistributionStats"],
        queryFn: () => Statistics.getAgeDistributionStats(),
    });
};

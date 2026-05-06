import { useQuery } from "@tanstack/react-query";
import { Statistics } from "@phoenixlan/phoenix.js";

export const useUserbaseStatistics = () => {
    return useQuery({
        queryKey: ["userbaseStatistics"],
        queryFn: () => Statistics.getUserbaseStatistics(),
    });
};

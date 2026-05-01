import { useQuery } from "@tanstack/react-query";
import { getCurrentEvent } from "@phoenixlan/phoenix.js";

export const useCurrentEvent = () => {
    return useQuery({
        queryKey: ["currentEvent"],
        queryFn: () => getCurrentEvent(),
    });
};

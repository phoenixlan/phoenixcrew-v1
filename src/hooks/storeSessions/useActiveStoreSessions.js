import { useQuery } from "@tanstack/react-query";
import { getActiveStoreSessions } from "@phoenixlan/phoenix.js";

export const useActiveStoreSessions = ({ refetchInterval } = {}) => {
    return useQuery({
        queryKey: ["activeStoreSessions"],
        queryFn: () => getActiveStoreSessions(),
        refetchInterval,
    });
};

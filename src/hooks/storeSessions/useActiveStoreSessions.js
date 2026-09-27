import { useQuery } from "@tanstack/react-query";
import { getActiveStoreSessions } from "@phoenixlan/phoenix.js";

export const useActiveStoreSessions = (eventUuid, { refetchInterval } = {}) => {
    return useQuery({
        queryKey: ["activeStoreSessions", eventUuid],
        queryFn: () => getActiveStoreSessions(eventUuid),
        enabled: !!eventUuid,
        refetchInterval,
    });
};

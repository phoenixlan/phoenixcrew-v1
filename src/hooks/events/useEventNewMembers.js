import { useQuery } from "@tanstack/react-query";
import { getEventNewMembers } from "@phoenixlan/phoenix.js";

export const useEventNewMembers = (eventUuid) => {
    return useQuery({
        queryKey: ["eventNewMembers", eventUuid],
        queryFn: () => getEventNewMembers(eventUuid),
        enabled: !!eventUuid,
    });
};

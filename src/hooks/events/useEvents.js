import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@phoenixlan/phoenix.js";

export const useEvents = () => {
    return useQuery({
        queryKey: ["events"],
        queryFn: () => getEvents(),
    });
};

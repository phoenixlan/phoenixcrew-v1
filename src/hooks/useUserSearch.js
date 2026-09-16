
import { useQuery } from "@tanstack/react-query";
import { User } from "@phoenixlan/phoenix.js";

export const useUserSearch = (query) => {
    return useQuery({
        queryKey: ["user_search", query],
        queryFn: () => User.searchUsers(query),
        enabled: (!!query) && query.length > 3,
    });
};

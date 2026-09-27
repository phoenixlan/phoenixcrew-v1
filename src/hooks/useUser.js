import { useQuery } from "@tanstack/react-query";
import { User } from "@phoenixlan/phoenix.js";

export const useUser = (userUuid) => {
    return useQuery({
        queryKey: ["user", userUuid],
        queryFn: () => User.getUser(userUuid),
        enabled: !!userUuid,
    });
};

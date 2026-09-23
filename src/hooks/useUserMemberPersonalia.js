import { useQuery } from "@tanstack/react-query";
import { User } from "@phoenixlan/phoenix.js";

export const useUserMemberPersonalia = (userUuid) => {
    return useQuery({
        queryKey: ["memberPersonalia", userUuid],
        queryFn: () => User.MemberPersonalia.getMemberPersonalia(userUuid),
        enabled: !!userUuid,
    });
};

import { useQuery } from "@tanstack/react-query";
import { User } from "@phoenixlan/phoenix.js";

export const useUserMembershipPersonalia = (userUuid) => {
    return useQuery({
        queryKey: ["membershipPersonalia", userUuid],
        queryFn: () => User.MembershipPersonalia.getMembershipPersonalia(userUuid),
        enabled: !!userUuid,
    });
};

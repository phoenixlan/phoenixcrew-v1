import { useQuery } from "@tanstack/react-query";
import { User } from "@phoenixlan/phoenix.js";

export const userPaymentsQueryKey = ["userPayments"];

export const useUserPayments = (userUuid) => {
    return useQuery({
        queryKey: [...userPaymentsQueryKey, userUuid],
        queryFn: () => User.getPayments(userUuid),
        enabled: !!userUuid,
    });
};

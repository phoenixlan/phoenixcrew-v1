import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventBrand } from "@phoenixlan/phoenix.js";
import { eventBrandCrewQueryKey } from "./useBrandCrews";
import { eventBrandsQueryKey } from "../../contexts/eventBrands";

export const useCreateEventBrandMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({name, contact_email }) => EventBrand.createEventBrand(name, contact_email),
        onSettled: () => {
            queryClient.invalidateQueries(eventBrandsQueryKey);
        },
    });
};

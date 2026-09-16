import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventBrand } from "@phoenixlan/phoenix.js";
import { eventBrandCrewQueryKey } from "./useBrandCrews";

export const useCreateCrewMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({name, description, hex_color, event_brand_uuid}) => EventBrand.createCrew(name, description, hex_color, event_brand_uuid),
        onSettled: () => {
            queryClient.invalidateQueries([eventBrandCrewQueryKey]);
        },
    });
};

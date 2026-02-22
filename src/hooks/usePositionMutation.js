import { useMutation, useQueryClient } from 'react-query';
import { Position, PositionMapping } from '@phoenixlan/phoenix.js';

export const useCreatePositionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data) => Position.createPosition(data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['positions']);
            },
        }
    );
};

export const useCreatePositionMappingMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ positionUuid, userUuid, eventUuid }) => PositionMapping.createPositionMapping(positionUuid, userUuid, eventUuid),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['position']);
                queryClient.invalidateQueries(['user']);
            },
        }
    );
};

export const useDeletePositionMappingMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ uuid }) => PositionMapping.deletePositionMapping(uuid),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['position']);
                queryClient.invalidateQueries(['user']);
            },
        }
    );
};

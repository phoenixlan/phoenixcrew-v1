import { useMutation, useQueryClient } from 'react-query';
import { Seatmap, Row } from '@phoenixlan/phoenix.js';

export const useCreateSeatmapMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data) => Seatmap.createSeatmap(data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['seatmaps']);
            },
        }
    );
};

export const useAddRowMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ seatmapUuid, data }) => Seatmap.addRow(seatmapUuid, data),
        {
            onSuccess: (_, { seatmapUuid }) => {
                queryClient.invalidateQueries(['seatmap', seatmapUuid]);
            },
        }
    );
};

export const useUpdateRowMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ rowUuid, data }) => Row.updateRow(rowUuid, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['seatmap']);
            },
        }
    );
};

export const useAddSeatMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ rowUuid, data }) => Row.addSeat(rowUuid, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['seatmap']);
            },
        }
    );
};

export const useUploadBackgroundMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ seatmapUuid, file }) => Seatmap.uploadBackground(seatmapUuid, file),
        {
            onSuccess: (_, { seatmapUuid }) => {
                queryClient.invalidateQueries(['seatmap', seatmapUuid]);
            },
        }
    );
};

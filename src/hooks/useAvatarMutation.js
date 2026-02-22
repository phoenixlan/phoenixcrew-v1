import { useMutation, useQueryClient } from 'react-query';
import { Avatar } from '@phoenixlan/phoenix.js';

export const useSetAvatarApprovedMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ uuid, approved }) => Avatar.setApproved(uuid, approved),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['unapprovedAvatars']);
            },
        }
    );
};

export const useDeleteAvatarMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ uuid }) => Avatar.deleteAvatar(uuid),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['unapprovedAvatars']);
                queryClient.invalidateQueries(['user']);
            },
        }
    );
};

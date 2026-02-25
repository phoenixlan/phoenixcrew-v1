import { useMutation, useQueryClient } from 'react-query';
import { User } from '@phoenixlan/phoenix.js';

export const useModifyUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ uuid, data }) => User.modifyUser(uuid, data),
        {
            onSuccess: (_, { uuid }) => {
                queryClient.invalidateQueries(['user', uuid]);
                queryClient.invalidateQueries(['users']);
            },
        }
    );
};

export const useActivateUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ uuid }) => User.activateUser(uuid),
        {
            onSuccess: (_, { uuid }) => {
                queryClient.invalidateQueries(['user', uuid]);
                queryClient.invalidateQueries(['users']);
            },
        }
    );
};

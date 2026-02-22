import { useMutation, useQueryClient } from 'react-query';
import { Crew } from '@phoenixlan/phoenix.js';

export const useAnswerApplicationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ uuid, answer }) => Crew.Applications.answerApplication(uuid, answer),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['crewApplications']);
                queryClient.invalidateQueries(['crew']);
            },
        }
    );
};

export const useHideApplicationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ uuid }) => Crew.Applications.hideApplication(uuid),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['crewApplications']);
            },
        }
    );
};

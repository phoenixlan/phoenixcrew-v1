import { useMutation, useQueryClient } from 'react-query';
import { addEventTicketType } from '@phoenixlan/phoenix.js';

export const useAddEventTicketTypeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ eventUuid, ticketTypeUuid }) => addEventTicketType(eventUuid, ticketTypeUuid),
        {
            onSuccess: (_, { eventUuid }) => {
                queryClient.invalidateQueries(['event', eventUuid]);
                queryClient.invalidateQueries(['eventTicketTypes', eventUuid]);
            },
        }
    );
};

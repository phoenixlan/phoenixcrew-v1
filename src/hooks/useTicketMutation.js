import { useMutation, useQueryClient } from 'react-query';
import { Ticket } from '@phoenixlan/phoenix.js';

export const useCreateTicketMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ ticketTypeUuid, userUuid }) => Ticket.createTicket(ticketTypeUuid, userUuid),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['eventTickets']);
                queryClient.invalidateQueries(['ticketTypes']);
            },
        }
    );
};

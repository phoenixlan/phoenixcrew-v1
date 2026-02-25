import { useMutation, useQueryClient } from 'react-query';
import { TicketVoucher } from '@phoenixlan/phoenix.js';

export const useCreateTicketVoucherMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ ticketTypeUuid, userUuid, recipientUserUuid }) => TicketVoucher.createTicketVoucher(ticketTypeUuid, userUuid, recipientUserUuid),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['ticketVouchers']);
            },
        }
    );
};

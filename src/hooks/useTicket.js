import { useQuery } from 'react-query';
import { Ticket, TicketType } from '@phoenixlan/phoenix.js';

export const useTicket = (id) => {
    return useQuery(['ticket', id], () => Ticket.getTicket(id), {
        enabled: !!id,
    });
};

export const useTicketTypes = () => {
    return useQuery(['ticketTypes'], () => TicketType.getTicketTypes());
};

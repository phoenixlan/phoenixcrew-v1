import { useQuery } from 'react-query';
import { TicketVoucher } from '@phoenixlan/phoenix.js';

export const useTicketVouchers = () => {
    return useQuery(['ticketVouchers'], () => TicketVoucher.getTicketVouchers());
};

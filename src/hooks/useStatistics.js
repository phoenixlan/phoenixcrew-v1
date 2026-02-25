import { useQuery } from 'react-query';
import { Statistics } from '@phoenixlan/phoenix.js';

export const useUserbaseStatistics = () => {
    return useQuery(['userbaseStatistics'], () => Statistics.getUserbaseStatistics());
};

export const useAgeDistribution = () => {
    return useQuery(['ageDistribution'], () => Statistics.getAgeDistributionStats());
};

export const useTicketSalesStatistics = (showFree) => {
    return useQuery(['ticketSalesStatistics', showFree], () => Statistics.getTicketSaleData(showFree));
};

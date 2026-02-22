import { useQuery } from 'react-query';
import { getActiveStoreSessions } from '@phoenixlan/phoenix.js';

export const useActiveStoreSessions = () => {
    return useQuery(['activeStoreSessions'], () => getActiveStoreSessions());
};

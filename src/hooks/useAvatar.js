import { useQuery } from 'react-query';
import { Avatar } from '@phoenixlan/phoenix.js';

export const useUnapprovedAvatars = () => {
    return useQuery(['unapprovedAvatars'], () => Avatar.getPendingAvatars());
};

import { useQuery } from 'react-query';
import { User } from '@phoenixlan/phoenix.js';

export const useUsers = () => {
    return useQuery(['users'], () => User.getUsers());
};

export const useUser = (uuid) => {
    return useQuery(['user', uuid], () => User.getUser(uuid), {
        enabled: !!uuid,
    });
};

export const useAuthenticatedUser = () => {
    return useQuery(['authenticatedUser'], () => User.getAuthenticatedUser());
};

export const useUserActivationState = (uuid, options = {}) => {
    return useQuery(['userActivationState', uuid], () => User.getUserActivationState(uuid), {
        enabled: !!uuid,
        ...options,
    });
};

export const useUserMembershipStatus = (uuid, options = {}) => {
    return useQuery(['userMembershipStatus', uuid], () => User.getUserMembershipStatus(uuid), {
        enabled: !!uuid,
        ...options,
    });
};

export const useUserDiscordMapping = (uuid) => {
    return useQuery(['userDiscordMapping', uuid], () => User.getDiscordMapping(uuid), {
        enabled: !!uuid,
    });
};

export const useUserOwnedTickets = (uuid) => {
    return useQuery(['userOwnedTickets', uuid], () => User.getOwnedTickets(uuid), {
        enabled: !!uuid,
    });
};

export const useUserPurchasedTickets = (uuid) => {
    return useQuery(['userPurchasedTickets', uuid], () => User.getPurchasedTickets(uuid), {
        enabled: !!uuid,
    });
};

export const useUserSeatableTickets = (uuid) => {
    return useQuery(['userSeatableTickets', uuid], () => User.getSeatableTickets(uuid), {
        enabled: !!uuid,
    });
};

export const useUserApplications = (uuid) => {
    return useQuery(['userApplications', uuid], () => User.getApplications(uuid), {
        enabled: !!uuid,
    });
};

export const useSearchUsers = (query) => {
    return useQuery(['searchUsers', query], () => User.searchUsers(query), {
        enabled: query.length >= 3,
    });
};

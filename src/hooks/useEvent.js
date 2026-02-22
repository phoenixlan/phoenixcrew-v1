import { useQuery } from 'react-query';
import { getCurrentEvent, getEvents, getEvent, getEventTicketTypes, getEventTickets, getEventNewMembers } from '@phoenixlan/phoenix.js';

export const useEvents = () => {
    return useQuery(['events'], () => getEvents());
};

export const useEvent = (uuid) => {
    return useQuery(['event', uuid], () => getEvent(uuid), {
        enabled: !!uuid,
    });
};

export const useCurrentEvent = () => {
    return useQuery(['currentEvent'], () => getCurrentEvent());
};

export const useEventTicketTypes = (eventUuid) => {
    return useQuery(['eventTicketTypes', eventUuid], () => getEventTicketTypes(eventUuid), {
        enabled: !!eventUuid,
    });
};

export const useEventTickets = (eventUuid) => {
    return useQuery(['eventTickets', eventUuid], () => getEventTickets(eventUuid), {
        enabled: !!eventUuid,
    });
};

export const useEventNewMembers = (eventUuid) => {
    return useQuery(['eventNewMembers', eventUuid], () => getEventNewMembers(eventUuid), {
        enabled: !!eventUuid,
    });
};

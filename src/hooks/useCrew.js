import { useQuery } from 'react-query';
import { Crew, getApplicationsByEvent } from '@phoenixlan/phoenix.js';

export const useCrews = () => {
    return useQuery(['crews'], () => Crew.getCrews());
};

export const useCrew = (uuid) => {
    return useQuery(['crew', uuid], () => Crew.getCrew(uuid), {
        enabled: !!uuid,
    });
};

export const useCrewApplications = (eventUuid) => {
    return useQuery(['crewApplications', eventUuid], () => getApplicationsByEvent(eventUuid), {
        enabled: !!eventUuid,
    });
};

import { useQuery } from 'react-query';
import { Agenda } from '@phoenixlan/phoenix.js';

export const useAgendaEntries = (eventUuid) => {
    return useQuery(['agendaEntries', eventUuid], () => Agenda.getAgenda(eventUuid), {
        enabled: !!eventUuid,
    });
};

export const useAgendaEntry = (uuid) => {
    return useQuery(['agendaEntry', uuid], () => Agenda.getAgendaElement(uuid), {
        enabled: !!uuid,
    });
};

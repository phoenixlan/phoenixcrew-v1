import { useMutation, useQueryClient } from 'react-query';
import { Agenda } from '@phoenixlan/phoenix.js';

export const useCreateAgendaEntryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (data) => Agenda.createAgendaEntry(data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['agendaEntries']);
            },
        }
    );
};

export const useModifyAgendaEntryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ uuid, data }) => Agenda.modifyAgendaEntry(uuid, data),
        {
            onSuccess: (_, { uuid }) => {
                queryClient.invalidateQueries(['agendaEntry', uuid]);
                queryClient.invalidateQueries(['agendaEntries']);
            },
        }
    );
};

export const useDeleteAgendaEntryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ uuid }) => Agenda.deleteAgendaEntry(uuid),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['agendaEntries']);
            },
        }
    );
};

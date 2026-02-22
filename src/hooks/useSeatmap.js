import { useQuery } from 'react-query';
import { Seatmap, Entrance } from '@phoenixlan/phoenix.js';

export const useSeatmaps = () => {
    return useQuery(['seatmaps'], () => Seatmap.getSeatmaps());
};

export const useSeatmap = (uuid) => {
    return useQuery(['seatmap', uuid], () => Seatmap.getSeatmap(uuid), {
        enabled: !!uuid,
    });
};

export const useEntrances = () => {
    return useQuery(['entrances'], () => Entrance.getEntrances());
};

export const useSeatmapAvailability = (uuid) => {
    return useQuery(['seatmapAvailability', uuid], () => Seatmap.getSeatmapAvailability(uuid), {
        enabled: !!uuid,
    });
};

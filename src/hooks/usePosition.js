import { useQuery } from 'react-query';
import { Position } from '@phoenixlan/phoenix.js';

export const usePositions = () => {
    return useQuery(['positions'], () => Position.getPositions());
};

export const usePosition = (uuid) => {
    return useQuery(['position', uuid], () => Position.getPosition(uuid), {
        enabled: !!uuid,
    });
};

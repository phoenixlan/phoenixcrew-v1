import { useMutation } from 'react-query';
import { Email } from '@phoenixlan/phoenix.js';

export const useSendEmailMutation = () => {
    return useMutation(
        (data) => Email.send(data),
    );
};

import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom'

import { AuthenticationContext } from '../components/authentication';

export const PrivateRoute = ({ children, redirect = '/login', ...rest }) => {
    const { authUser } = useContext(AuthenticationContext);

    return (
        <Route
            {...rest}
            render={() => {
                return authUser ? children : <Redirect to={redirect} />;
            }}
        />
    );
}
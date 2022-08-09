import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom'

import { AuthenticationContext } from '../components/authentication';

export const PublicRoute = ({ children, redirect = '/', ...rest }) => {
    const { authUser } = useContext(AuthenticationContext);

    return (
        <Route
            {...rest}
            render={() => {
                return authUser ? <Redirect to={redirect} /> : children;
            }}
        />
    );
}
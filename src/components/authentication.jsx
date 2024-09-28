import React, { useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";

import { User } from "@phoenixlan/phoenix.js";

/// Create authentication context
export const AuthenticationContext = React.createContext({});

/// Authentication function
export const Authentication = (props) => {

    /// States
    const [errorMessage, setErrorMessage]               = useState(null);
    const [shouldDisplayError, setShouldDisplayError]   = useState(false);
    const [loadingFinished, setLoadingFinished]         = useState(false);
    

    /// Check if url contains "code"
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    /// User Management
    let [authUser, setAuthUser] = useState(null);
    let [roles, setRoles] = useState(null);

    /// Functions for user management
        /// Set an error message and show the error container (E)
        function setError(text) {
            console.error(text);
            setErrorMessage(text);
            setShouldDisplayError(true);
            console.error(text);
        }
        
        /// Logout function, used with the Authentication Context
        function logout() {
            setAuthUser(null);
            window.localStorage.removeItem("auth");
        }
        

        

    useEffect(() => {
        // Give PhoenixJS a callback that will be used to notify when the refesh token changed from within
        User.Oauth.setTokensUpdateCallback((new_token, new_refresh_token) => {
            window.localStorage.setItem("auth", JSON.stringify({
                token: new_token,
                refreshToken: new_refresh_token,
            }));
        })

        /// Check if the user is already authenticated or is requesting to be authenticated.
        const checkAuth = async () => {
            setLoadingFinished(false);
            /// Create storage variable with information from local storage.
            const storage = window.localStorage.getItem("auth");

            /// Check if "auth" exists in the localstorage, yes=authenticate by storage; no=check if url has code and authenticate by this.
            if(!storage) {

                /// Check if the URL contains a code
                if (code) {
                    try {
                        /// Get token, refreshToken and set user based on token & refreshToken.
                        await User.Oauth.authenticateByCode(code);
                        
                        let Token = await User.Oauth.getToken();
                        setAuthUser(await User.getAuthenticatedUser());
                        //let RefreshToken = await User.Oauth.getRefreshToken();

                        /// Store user information in the local storage for later use.
                        /*
                        window.localStorage.setItem("auth", JSON.stringify({
                            token: Token,
                            refreshToken: RefreshToken,
                        }));
                        */
                        setRoles(jwt_decode(Token).roles);
                        setLoadingFinished(true);
                    } 
                    catch (e) {
                        /// If authenticatebycode fails, set an error message displayed in console and to the user. (Might need some styling)
                        console.error('An error occured, failed to authenticate by token. (Is the token valid?)');
                        console.error('[API] ' + e);
                        setError('An error occured, failed to authenticate by token. (Is the token valid?)');
                        setLoadingFinished(true);
                    }
                } else {
                    /// If there is no "auth" in the local storage, show login page.
                    console.warn("Requested information was not found in the local storage.");
                    setLoadingFinished(true);
                }
            }

            else {
                /// If storage contains "auth" with correct information.
                let object = JSON.parse(storage);
                if(object.token && object.refreshToken) {
                    /// Try to setAuthState with existing token & refreshToken.
                    try {
                        await User.Oauth.setAuthState(object.token, object.refreshToken);

                        // If we are already logged in as someone, only update if the user uuid is updated.
                        const authenticatedUser = await User.getAuthenticatedUser();                        
                        setAuthUser(authenticatedUser);

                        setRoles(jwt_decode(object.token).roles);
                        setLoadingFinished(true);
                    }
                    catch (e) {
                        /// If the attempt of authenticating with the existing token & refreshToken fails, remove auth from localstorage to clean up and let the user try again.
                        window.localStorage.removeItem("auth");
                        console.error('[API] ' + e);

                        setError("Vi klarte ikke å logge deg inn med den eksisterende påloggingsinformasjonen som eksisterte på enheten din. Vennligst logg inn på nytt.");
                        setLoadingFinished(true);
                    }
                } 
                /// Conclude that local storage is corrupted or modified by the user or third-party app, delete the data.
                else {
                    window.localStorage.removeItem("auth");

                    setError("Vi klarte ikke å logge deg inn med den eksisterende påloggingsinformasjonen som eksisterte på enheten din. Vennligst logg inn på nytt.");
                    setLoadingFinished(true);
                }
            }
        }
        // If local storage is updated from another tab, refresh auth as if the page was loaded.
        window.onstorage = () => {
            // When local storage changes, dump the list to
            // the console.
            const current_storage = window.localStorage.getItem("auth")
            if(!current_storage) {
                // We were logged out? Then log us out
                setLoadingFinished(false);
                setAuthUser(null);
            }
            checkAuth();
        };

        checkAuth();
    }, []);

    return(
        <>
            <AuthenticationContext.Provider value={{authUser, logout, roles, shouldDisplayError, errorMessage, loadingFinished}}>
                {props.children}
            </AuthenticationContext.Provider>
        </>
    );
}
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useState } from "react";
import { InnerContainerRow, Navigation, NavigationContainer, NavigationElement, NavigationSpacer } from "../components/bottomnavigation";
import { useHistory } from "react-router-dom";
import { AuthenticationContext } from "../components/authentication";
import { Sidebar } from "./sidebar";

export const mobileContext = React.createContext({})
export const MobileNavigation = () => {

    const [ showSidebar, setShowSidebar ] = useState(false);

    let history = useHistory();
    const auth = useContext(AuthenticationContext);

    return (
        <>
            <Navigation visible={showSidebar} >
                <Sidebar />
            </Navigation>
            <NavigationContainer>
                <InnerContainerRow>
                    <NavigationElement icon={faBars} title="Meny" onClick={() => setShowSidebar(!showSidebar)} />
                    <NavigationSpacer />
                    <NavigationElement icon={faUser} title="Min bruker" onClick={() => history.push(`/user/${auth.authUser.uuid}`)} />
                </InnerContainerRow>
            </NavigationContainer>
        </>
    )
}
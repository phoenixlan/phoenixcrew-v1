import { faBars, faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useState } from "react";
import { InnerContainerRow, Navigation, NavigationContainer, NavigationElement, NavigationSpacer } from "../components/bottomnavigation";
import { useHistory } from "react-router-dom";
import { AuthenticationContext } from "../components/authentication";
import { Sidebar } from "./sidebar";

export const mobileContext = React.createContext({})
export const MobileNavigation = () => {

    const [ showSidebar, setShowSidebar ] = useState(false);
    const toTop = () => {
        window.scroll(0, 0);
    }

    let history = useHistory();
    const auth = useContext(AuthenticationContext);

    return (
        <>
            <NavigationContainer>
                <InnerContainerRow>
                    <NavigationElement icon={faBars} title="Meny" onClick={() => setShowSidebar(!showSidebar)} />
                    <NavigationSpacer />
                    <NavigationElement icon={faUser} title="Min bruker" onClick={() => history.push(`/user/${auth.authUser.uuid}`)} />
                    <NavigationElement icon={faSignOutAlt} title="Logg ut" onClick={() => auth.logout()} />
                </InnerContainerRow>
            </NavigationContainer>
            <Navigation visible={showSidebar} >
                <mobileContext.Provider value={{setShowSidebar, toTop}}>
                    <Sidebar />
                </mobileContext.Provider>
            </Navigation>
        </>
    )
}
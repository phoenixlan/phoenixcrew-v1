import React from "react"
import { useHistory } from 'react-router-dom';

import { DashboardContent, DashboardHeader, InnerContainer, } from "../components/dashboard";

export const NotAvailable = () => {

    let history = useHistory();

    return (
        <>
            <DashboardHeader>
                <DashboardContent>
                    <InnerContainer>
                        Denne siden og/eller funksjonen er ikke ferdig utviklet og er derfor utilgjengelig.<br />
                        <a href="" onClick={() => history.goBack()}>Ta meg tilbake til forrige side!</a>
                    </InnerContainer>
                </DashboardContent>
            </DashboardHeader>
        </>
    )
}
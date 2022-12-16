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
                        <a href="" onClick={() => history.push("/")}>Ta meg tilbake til hovedsiden!</a>
                    </InnerContainer>
                </DashboardContent>
            </DashboardHeader>
        </>
    )
}
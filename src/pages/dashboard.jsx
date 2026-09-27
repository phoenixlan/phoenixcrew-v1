import React from "react";
import { useBrand } from "../contexts/brand";

export const Dashboard = () => {
    const brandContext = useBrand();

    return (
        <>
            <h1>{brandContext ? brandContext.brand.name : "Phoenix EMS"}</h1>
            {brandContext
                ? <p>{brandContext.currentEvent ? `Aktivt arrangement: ${brandContext.currentEvent.name}` : "Denne merkevaren har ikke et aktivt arrangement."}</p>
                : <p>Velg en merkevare i menyen for å administrere et arrangement.</p>}
        </>
    )
}

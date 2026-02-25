import React from "react";

import { useAuthenticatedUser } from "../hooks/useUser";

export const Dashboard = () => {
    const { data: user } = useAuthenticatedUser();

    return (
        <>

        </>
    )
}

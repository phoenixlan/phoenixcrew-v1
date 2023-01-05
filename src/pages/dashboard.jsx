import React, { useEffect } from "react";

import { User } from "@phoenixlan/phoenix.js";

export const Dashboard = () => {
    
    useEffect(async () => {
        const asyncFunction = async () => {
            const user = await User.getAuthenticatedUser();
            console.log(user);
        }
        asyncFunction();
    })

    return (
        <>

        </>
    )
}
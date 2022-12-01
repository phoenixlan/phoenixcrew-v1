import React, { useEffect } from "react";

import { User, Crew, Team } from "@phoenixlan/phoenix.js";

import styled from 'styled-components';


export const Dashboard = () => {
    
    useEffect(async () => {
        const asyncFunction = async () => {
            const user = await User.getAuthenticatedUser();
            console.log(user);
        }
        asyncFunction();
    })
    
    console.log();

    return (
        <>

        </>
    )
}
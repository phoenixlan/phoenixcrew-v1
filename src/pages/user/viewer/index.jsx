import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { User, Crew } from "@phoenixlan/phoenix.js";
import { PageLoading } from '../../../components/pageLoading';
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle } from '../../../components/dashboard';

import { UserViewerDetails } from './details';
import { UserViewerExternalConnections } from './externalConnections';
import { UserViewerTickets } from './tickets';
import { UserPositions, UserViewerPositions } from './positions';
import { Notice } from '../../../components/containers/notice';
import { UserViewerApplications } from './applications';

const TABS = {
    USER_DETAILS: 1,
    POSITIONS: 2,
    TICKETS: 3,
    INTEGRATIONS: 4,
    APPLICATIONS: 5
}

export const ViewUser = (props) => {
    const { uuid } = useParams();
    const [ user, setUser ] = useState(null);

    const [activeContent, setActiveContent] = useState(1);

    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    const reload = async () => {
        setLoading(true);

        let user;

        // Try to get user information or throw an error if it fails.
        try {
            user = await User.getUser(uuid);
        } catch(e) {
            console.error("An error occured while attempting to gather user information:\n" + e);
            setError(e);
        }
        
        if(user) {
            // Fetch more info about the user
            await Promise.all(user.position_mappings.map(async (position_mapping) => {
                const position = position_mapping.position;
                if(position.crew_uuid) {
                    position.crew = await Crew.getCrew(position.crew_uuid);
                    if(position.team_uuid) {
                        position.team = position.crew.teams.find((team) => team.uuid === position.team_uuid)
                    }
                }
            }));
            setUser(user);
        }

        setLoading(false);
    };

    useEffect(() => {
        reload().catch(e => {
            console.log(e);
        })
    }, []);


    // Show loading page
    if(loading) {
        return (<PageLoading />)
    } 
    
    // Show user page
    else if(user) {
        return (
            <>
                <DashboardHeader>
                    <DashboardTitle>
                        Bruker
                    </DashboardTitle>
                    <DashboardSubtitle>
                        {user.firstname} {user.lastname}
                    </DashboardSubtitle>
                </DashboardHeader>

                <DashboardBarSelector border>
                    <DashboardBarElement active={activeContent === TABS.USER_DETAILS} onClick={() => setActiveContent(TABS.USER_DETAILS)}>Brukerinformasjon</DashboardBarElement>
                    <DashboardBarElement active={activeContent === TABS.POSITIONS} onClick={() => setActiveContent(TABS.POSITIONS)}>Stillinger</DashboardBarElement>
                    <DashboardBarElement active={activeContent === TABS.TICKETS} onClick={() => setActiveContent(TABS.TICKETS)}>Billetter</DashboardBarElement>
                    <DashboardBarElement active={activeContent === TABS.INTEGRATIONS} onClick={() => setActiveContent(TABS.INTEGRATIONS)}>Eksterne tilkoblinger</DashboardBarElement>
                    <DashboardBarElement active={activeContent === TABS.APPLICATIONS} onClick={() => setActiveContent(TABS.APPLICATIONS)}>Søknader</DashboardBarElement>
                </DashboardBarSelector>
                
                <DashboardContent visible={activeContent === TABS.USER_DETAILS}>
                    <UserViewerDetails inheritUser={user} />
                </DashboardContent>

                <DashboardContent visible={activeContent === TABS.POSITIONS}>
                    <UserPositions />
                </DashboardContent>

                <DashboardContent visible={activeContent === TABS.TICKETS}>
                    <UserViewerTickets user={user} />
                </DashboardContent>

                <DashboardContent visible={activeContent === TABS.INTEGRATIONS}>
                    <UserViewerExternalConnections user={user} />
                </DashboardContent>

                <DashboardContent visible={activeContent === TABS.APPLICATIONS}>
                    <UserViewerApplications user={user} />
                </DashboardContent>
            </>
        )
    }

    // Show error if user is not set.
    else {
        return (
            <>
                <DashboardHeader border>
                    <DashboardTitle>
                        Bruker
                    </DashboardTitle>
                </DashboardHeader>

                <DashboardContent>
                    <Notice type="error" visible={true}>
                        Det oppsto en feil ved henting av informasjon for denne brukeren.<br />
                        {error.message}
                    </Notice>
                </DashboardContent>
            </>
        )
    }
};
import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { BASE_URL } from "../../"

import { User, Crew, Team } from "@phoenixlan/phoenix.js";

import { ChildTable, ChildTableRow, ChildTableColumn, ChildTableHeader } from "../../components/childTable";
import { PageContainer } from "../../components/blocks"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight }  from '@fortawesome/free-solid-svg-icons'

import { PageLoading } from "../../components/pageLoading"

const S = {
    WideLink: styled(Link)`
    width: 100%
    `
}

const ApplicationTableEntry = ({ application }) => {
    let history = useHistory();
    
    return (
        <ChildTableRow key={application.uuid} onClick={e => {history.push(`/application/${application.uuid}`)}}>
            <ChildTableColumn>{application.user.firstname} {application.user.lastname}</ChildTableColumn>
            <ChildTableColumn>{application.crew.name}</ChildTableColumn>
            <ChildTableColumn>{new Date(application.created*1000).toLocaleString()}</ChildTableColumn>
            <ChildTableColumn>Les søknad <FontAwesomeIcon icon={faChevronRight}/></ChildTableColumn>
        </ChildTableRow>
    )
}

const ApplicationTable = ({ applications }) => {
    return (<ChildTable>
        <thead>
            <ChildTableHeader>
                <ChildTableColumn>Navn</ChildTableColumn>
                <ChildTableColumn>Crew</ChildTableColumn>
                <ChildTableColumn>Søknadstid</ChildTableColumn>
            </ChildTableHeader>
            
        </thead>
        <tbody>
        {
            applications.map((application) => <ApplicationTableEntry application={application}/>)
        }
        </tbody>
    </ChildTable>)
}

export const ListApplications = (props) => {
    const [applicationList, setApplicationList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const asyncInner = async () => {
            const applicationList = await Crew.Applications.getAllApplications()
            if(applicationList) {
                console.log("Fetched applicationList:")
                console.log(applicationList);

                setApplicationList(applicationList)
                setLoading(false);

            } else {
                console.log("Fuck");
            }
        }
        asyncInner().catch(e => {
            console.log(e);
        })
    }, []);


    if(loading) {
        return (<PageLoading />)
    }
    //TODO not quite right, backend har ikke application state enda
    return (<PageContainer>
        <h1>Søknader</h1>
        <h2>Åpne søknader</h2>
        <ApplicationTable applications={applicationList.filter(application => application.state === "ApplicationState.created")} />
        <h2>Avslåtte søknader</h2>
        <ApplicationTable applications={applicationList.filter(application => application.state === "ApplicationState.rejected")} />
        <h2>Godkjente søknader</h2>
        <ApplicationTable applications={applicationList.filter(application => application.state === "ApplicationState.accepted")} />
    </PageContainer>)
};
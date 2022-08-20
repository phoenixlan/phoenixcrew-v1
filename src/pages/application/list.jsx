import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { BASE_URL } from "../../"

import { User, Crew, Team } from "@phoenixlan/phoenix.js";

import { Table, SelectableRow, Column, TableHeader } from "../../components/table";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight }  from '@fortawesome/free-solid-svg-icons'

import { PageLoading } from "../../components/pageLoading"

const S = {
    WideLink: styled(Link)`
    width: 100%
    `
}

const ApplicationTableEntry = ({ application, showProcessedBy }) => {
    let history = useHistory();
    
    return (
        <SelectableRow key={application.uuid} onClick={e => {history.push(`/application/${application.uuid}`)}}>
            <Column>{application.user.firstname} {application.user.lastname}</Column>
            <Column>{application.crew.name}</Column>
            <Column>{new Date(application.created*1000).toLocaleString()}</Column>
            {
                showProcessedBy ? (
                    <Column>{application.last_processed_by ? `${application.last_processed_by.firstname} ${application.last_processed_by.lastname}` : "Ingen"}</Column>
                ) : null
            }
            <Column>Les søknad <FontAwesomeIcon icon={faChevronRight}/></Column>
        </SelectableRow>
    )
}

const ApplicationTable = ({ applications, showProcessedBy }) => {
    return (<Table>
        <thead>
            <TableHeader>
                <Column>Navn</Column>
                <Column>Crew</Column>
                <Column>Søknadstid</Column>
                {
                    showProcessedBy ? (<Column>Behandler</Column>) : null
                }
            </TableHeader>
            
        </thead>
        <tbody>
        {
            applications.map((application) => <ApplicationTableEntry showProcessedBy={showProcessedBy} application={application}/>)
        }
        </tbody>
    </Table>)
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
    return (<div>
        <h1>Søknader</h1>
        <h2>Åpne søknader</h2>
        <ApplicationTable applications={applicationList.filter(application => application.state === "ApplicationState.created")} />
        <h2>Avslåtte søknader</h2>
        <ApplicationTable showProcessedBy={true} applications={applicationList.filter(application => application.state === "ApplicationState.rejected")} />
        <h2>Godkjente søknader</h2>
        <ApplicationTable showProcessedBy={true} applications={applicationList.filter(application => application.state === "ApplicationState.accepted")} />
    </div>)
};
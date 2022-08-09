import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { BASE_URL } from "../../"

import { User, Crew, Team } from "@phoenixlan/phoenix.js";

import { Table, SelectableRow, Column, TableHeader, IconContainer } from "../../components/table";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faChevronRight }  from '@fortawesome/free-solid-svg-icons'

import { PageLoading } from "../../components/pageLoading"
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardElementSelector, DashboardHeader, DashboardTitle, InnerContainer, InputCheckbox, InputRadio } from '../../components/dashboard';

const S = {
    WideLink: styled(Link)`
    width: 100%
    `
}

const ApplicationTableEntry = ({ application, showProcessedBy }) => {
    let history = useHistory();

    const stateToString = (state) => {
        if(state == "ApplicationState.rejected") {
            return "Avslått";
        }
        if(state == "ApplicationState.accepted") {
            return "Akseptert";
        }
    }
    
    return (
        <SelectableRow key={application.uuid} onClick={e => {history.push(`/application/${application.uuid}`)}}>
            <Column flex="3">{application.user.firstname} {application.user.lastname}</Column>
            <Column flex="3">{application.crew.name}</Column>
            <Column flex="3">{ new Date(application.created*1000).toLocaleString('default', {dateStyle: 'short', timeStyle: 'medium'}) }</Column>
            {
                showProcessedBy ? (
                    <>
                        <Column flex="3">{application.last_processed_by ? `${application.last_processed_by.firstname} ${application.last_processed_by.lastname}` : "Ingen"}</Column>
                        <Column flex="3">{stateToString(application.state)}</Column>
                    </>
                    ) : (
                    <>
                        <Column flex="3" />
                        <Column flex="3" />
                    </>
                    )
            }
            <Column flex="0 20px"><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
        </SelectableRow>
    )
}

const ApplicationTable = ({ applications, showProcessedBy }) => {
    return (
        <Table>
            <TableHeader border>
                <Column flex="3">Navn</Column>
                <Column flex="3">Crew</Column>
                <Column flex="3">Søknadstid</Column>
                {
                    showProcessedBy ? (
                        <>
                            <Column flex="3">Behandler</Column>
                            <Column flex="3">Status</Column>
                        </>
                    ) : (
                        <>
                            <Column flex="3" />
                            <Column flex="3" />
                        </>
                    )
                }
                
                <Column flex="0 20px"><IconContainer/></Column>
    
            </TableHeader>
            <tbody>
            {
                applications.map((application) => <ApplicationTableEntry showProcessedBy={showProcessedBy} application={application}/>)
            }
            </tbody>
        </Table>
    )
}

export const ListApplications = (props) => {
    const [applicationList, setApplicationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeContent, setActiveContent] = useState(1);
    const [sortingMethodArchive, setSortingMethodArchive] = useState(1);
    const [sortingMethodActive, setSortingMethodActive] = useState(1);

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



    return (
        <>
            <DashboardHeader>
                <DashboardTitle>
                    Søknader
                </DashboardTitle>
            </DashboardHeader>

            <DashboardBarSelector border>
                <DashboardBarElement active={activeContent == 1} onClick={() => setActiveContent(1)}>Aktive</DashboardBarElement>
                <DashboardBarElement active={activeContent == 2} onClick={() => setActiveContent(2)}>Arkiverte</DashboardBarElement>
            </DashboardBarSelector>

            <DashboardContent visible={activeContent == 1}>
                <InnerContainer>
                    Sorter søknader etter:
                    <InputRadio label="Fornavn, Etternavn" value={sortingMethodActive == 1} onChange={() => setSortingMethodActive(1)} />
                    <InputRadio label="Søknadstid" value={sortingMethodActive == 2} onChange={() => setSortingMethodActive(2)} />
                </InnerContainer>

                <InnerContainer visible={sortingMethodActive == 1}>
                    <ApplicationTable showProcessedBy applications={applicationList
                        .filter(application => application.state === "ApplicationState.created")
                        .sort((a, b) => a.user.lastname.localeCompare(b.user.lastname))} 
                    />
                </InnerContainer>

                <InnerContainer visible={sortingMethodActive == 2}>
                    <ApplicationTable showProcessedBy applications={applicationList
                        .filter(application => application.state === "ApplicationState.created")
                        .sort((a, b) => a.created - b.created)} 
                    />
                </InnerContainer>
            </DashboardContent>

            <DashboardContent visible={activeContent == 2}>
                <InnerContainer>
                    Sorter søknader etter:
                    <InputRadio label="Fornavn, Etternavn" value={sortingMethodArchive == 1} onChange={() => setSortingMethodArchive(1)} />
                    <InputRadio label="Søknadstid" value={sortingMethodArchive == 2} onChange={() => setSortingMethodArchive(2)} />
                    <InputRadio label="Status" value={sortingMethodArchive == 3} onChange={() => setSortingMethodArchive(3)} />
                </InnerContainer>

                <InnerContainer visible={sortingMethodArchive == 1}>
                    <ApplicationTable showProcessedBy applications={applicationList
                        .filter(application => application.state !== "ApplicationState.created")
                        .sort((a, b) => a.user.lastname.localeCompare(b.user.lastname))} 
                    />
                </InnerContainer>

                <InnerContainer visible={sortingMethodArchive == 2}>
                    <ApplicationTable showProcessedBy applications={applicationList
                        .filter(application => application.state !== "ApplicationState.created")
                        .sort((a, b) => a.created - b.created)} 
                    />
                </InnerContainer>

                <InnerContainer visible={sortingMethodArchive == 3}>
                    <ApplicationTable showProcessedBy applications={applicationList
                        .filter(application => application.state !== "ApplicationState.created")
                        .sort((a, b) => a.state.localeCompare(b.state))} 
                    />
                </InnerContainer>
            </DashboardContent>
        </>
    )
};
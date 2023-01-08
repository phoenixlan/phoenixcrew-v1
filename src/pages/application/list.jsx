import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Crew } from "@phoenixlan/phoenix.js";

import { Table, SelectableRow, Column, TableHeader, IconContainer } from "../../components/table";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight }  from '@fortawesome/free-solid-svg-icons'

import { PageLoading } from "../../components/pageLoading"
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardTitle, InnerContainer, InputContainer, InputElement, InputLabel } from '../../components/dashboard';

const ApplicationCrewLabel = ({ application_crew_mapping }) => {
    return (<>{application_crew_mapping.crew.name} {application_crew_mapping.accepted ? (<b>Godkjent!</b>) : null}</>)
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
            <Column flex="4" mqflex="3">{application.user.firstname} {application.user.lastname}</Column>
            <Column flex="3" mqflex="2"><ApplicationCrewLabel application_crew_mapping={application.crews[0]} /></Column>
            <Column flex="3" mqhide>{application.crews.length > 1 ? (<ApplicationCrewLabel application_crew_mapping={application.crews[1]} />) : ("Ingen")}</Column>
            <Column flex="3" mqhide>{application.crews.length > 2 ? (<ApplicationCrewLabel application_crew_mapping={application.crews[2]} />) : ("Ingen")}</Column>
            <Column flex="3" mqhide>{ new Date(application.created*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: '2-digit', month: '2-digit', day: '2-digit'}) }</Column>
            {
                showProcessedBy ? (
                    <>
                        <Column flex="4" mqhide>{application.last_processed_by ? `${application.last_processed_by.firstname} ${application.last_processed_by.lastname}` : "Ingen"}</Column>
                        <Column flex="2" mqhide>{stateToString(application.state)}</Column>
                    </>
                    ) : (
                    <>
                        <Column flex="4" mqhide />
                        <Column flex="2" mqhide />
                    </>
                    )
            }
            <Column flex="0 24px" mqhide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
        </SelectableRow>
    )
}

const ApplicationTable = ({ applications, showProcessedBy }) => {
    return (
        <Table>
            <TableHeader border>
                <Column flex="4" mqflex="3">Navn</Column>
                <Column flex="3" mqflex="2">1. Valg</Column>
                <Column flex="3" mqhide>2. Valg</Column>
                <Column flex="3" mqhide>3. Valg</Column>
                <Column flex="3" mqhide>Søknadstid</Column>
                {
                    showProcessedBy ? (
                        <>
                            <Column flex="4" mqhide>Behandler</Column>
                            <Column flex="2" mqhide>Status</Column>
                        </>
                    ) : (
                        <>
                            <Column flex="4" mqhide />
                            <Column flex="2" mqhide />
                        </>
                    )
                }
                
                <Column flex="0 24px" mqhide><IconContainer/></Column>
    
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
    const [sortingMethodArchive, setSortingMethodArchive] = useState(2);
    const [sortingMethodActive, setSortingMethodActive] = useState(2);

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
        return (
            <PageLoading />
        )
    }

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
                <InnerContainer mqrgap="4px">
                    Sorter søknader etter:
                    <InputContainer>
                        <InputElement name="1" type="radio" checked={sortingMethodActive === 1} onClick={() => setSortingMethodActive(1)} />
                        <InputLabel top="1px">Fornavn, Etternavn</InputLabel>
                    </InputContainer>
                    <InputContainer>
                        <InputElement name="1" type="radio" checked={sortingMethodActive === 2} onClick={() => setSortingMethodActive(2)} />
                        <InputLabel top="1px">Søknadstid</InputLabel>
                    </InputContainer>
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
                <InnerContainer mqrgap="4px">
                    Sorter søknader etter:
                    <InputContainer>
                        <InputElement name="2" type="radio" checked={sortingMethodArchive == 1} onClick={() => setSortingMethodArchive(1)} />
                        <InputLabel top="1px">Fornavn, Etternavn</InputLabel>
                    </InputContainer>
                    <InputContainer>
                        <InputElement name="2" type="radio" checked={sortingMethodArchive == 2} onClick={() => setSortingMethodArchive(2)} />
                        <InputLabel top="1px">Søknadstid</InputLabel>
                    </InputContainer>
                    <InputContainer>
                        <InputElement name="2" type="radio" checked={sortingMethodArchive == 3} onClick={() => setSortingMethodArchive(3)} />
                        <InputLabel top="1px">Status</InputLabel>
                    </InputContainer>
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
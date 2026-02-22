import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Table, SelectableTableRow, TableCell, TableHead, IconContainer, TableRow } from "../../components/table";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight }  from '@fortawesome/free-solid-svg-icons'

import { PageLoading } from "../../components/pageLoading"
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardTitle, InnerContainer, InnerContainerRow, InputContainer, InputElement, InputSelect, InputLabel } from '../../components/dashboard';
import { useCurrentEvent, useEvents } from '../../hooks/useEvent';
import { useCrewApplications } from '../../hooks/useCrew';

export const ApplicationCrewLabel = ({ application_crew_mapping }) => {
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
        <SelectableTableRow key={application.uuid} onClick={e => {history.push(`/application/${application.uuid}`)}}>
            <TableCell flex="4" mobileFlex="3">{application.user.firstname} {application.user.lastname}</TableCell>
            <TableCell flex="3" mobileFlex="2"><ApplicationCrewLabel application_crew_mapping={application.crews[0]} /></TableCell>
            <TableCell flex="3" mobileHide>{application.crews.length > 1 ? (<ApplicationCrewLabel application_crew_mapping={application.crews[1]} />) : (<i>Ingen</i>)}</TableCell>
            <TableCell flex="3" mobileHide>{application.crews.length > 2 ? (<ApplicationCrewLabel application_crew_mapping={application.crews[2]} />) : (<i>Ingen</i>)}</TableCell>
            <TableCell flex="3" mobileHide>{ new Date(application.created*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: '2-digit', month: '2-digit', day: '2-digit'}) }</TableCell>
            {
                showProcessedBy ? (
                    <>
                        <TableCell flex="4" mobileHide>{application.last_processed_by ? `${application.last_processed_by.firstname} ${application.last_processed_by.lastname}` : "Ingen"}</TableCell>
                        <TableCell flex="2" mobileHide>{stateToString(application.state)}</TableCell>
                    </>
                    ) : (
                    <>
                        <TableCell flex="4" mobileHide />
                        <TableCell flex="2" mobileHide />
                    </>
                    )
            }
            <TableCell flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
        </SelectableTableRow>
    )
}

const ApplicationTable = ({ applications, showProcessedBy }) => {
    return (
        <Table>
            <TableHead border>
                <TableRow>
                    <TableCell as="th" flex="4" mobileFlex="3">Navn</TableCell>
                    <TableCell as="th" flex="3" mobileFlex="2">1. Valg</TableCell>
                    <TableCell as="th" flex="3" mobileHide>2. Valg</TableCell>
                    <TableCell as="th" flex="3" mobileHide>3. Valg</TableCell>
                    <TableCell as="th" flex="3" mobileHide>Søknadstid</TableCell>
                    {
                        showProcessedBy ? (
                            <>
                                <TableCell as="th" flex="4" mobileHide>Behandler</TableCell>
                                <TableCell as="th" flex="2" mobileHide>Status</TableCell>
                            </>
                        ) : (
                            <>
                                <TableCell as="th" flex="4" mobileHide />
                                <TableCell as="th" flex="2" mobileHide />
                            </>
                        )
                    }

                    <TableCell as="th" flex="0 24px" mobileHide><IconContainer/></TableCell>
                </TableRow>
            </TableHead>
            <tbody>
            {
                applications.map((application) => <ApplicationTableEntry key={application.uuid} showProcessedBy={showProcessedBy} application={application}/>)
            }
            </tbody>
        </Table>
    )
}

const SORTING_METHODS = {
    SURNAME: 1,
    DATE: 2
}

const CATEGORIES = {
    NO_ANSWER: 1,
    ACCEPTED: 2,
    REJECTED: 3,
    HIDDEN: 4
}

const STATE_TO_PY_ENUM = {}
STATE_TO_PY_ENUM[CATEGORIES.NO_ANSWER] = "ApplicationState.created"
STATE_TO_PY_ENUM[CATEGORIES.ACCEPTED] = "ApplicationState.accepted"
STATE_TO_PY_ENUM[CATEGORIES.REJECTED] = "ApplicationState.rejected"

const FILTER_TYPES = {}
FILTER_TYPES[CATEGORIES.NO_ANSWER] = (application) => application.state === STATE_TO_PY_ENUM[CATEGORIES.NO_ANSWER] && !application.hidden
FILTER_TYPES[CATEGORIES.ACCEPTED] = (application) => application.state === STATE_TO_PY_ENUM[CATEGORIES.ACCEPTED] && !application.hidden
FILTER_TYPES[CATEGORIES.REJECTED] = (application) => application.state === STATE_TO_PY_ENUM[CATEGORIES.REJECTED] && !application.hidden
FILTER_TYPES[CATEGORIES.HIDDEN] = (application) => application.hidden

const SORT_TYPES = {}
SORT_TYPES[SORTING_METHODS.SURNAME] = (a, b) => a.user.lastname.localeCompare(b.user.lastname)
SORT_TYPES[SORTING_METHODS.DATE] = (a, b) => a.created - b.created

export const ListApplications = (props) => {
    const [activeCategory, setActiveCategory] = useState(1);
    const [activeSortingMethod, setActiveSortingMethod] = useState(1);
    const [ currentViewingEvent, setCurrentViewingEvent ] = useState(null);

    const { data: currentEvent, isLoading: currentEventLoading } = useCurrentEvent();
    const { data: events = [], isLoading: eventsLoading } = useEvents();

    // Set initial viewing event once data is loaded
    if (!currentEventLoading && currentViewingEvent === null && currentEvent) {
        setCurrentViewingEvent(currentEvent.uuid);
    }

    const effectiveViewingEvent = currentViewingEvent ?? currentEvent?.uuid;
    const { data: applicationList = [], isLoading: applicationsLoading } = useCrewApplications(effectiveViewingEvent);

    const updateViewingEvent = (event) => {
        setCurrentViewingEvent(event.target.value)
    }

    const isLoading = currentEventLoading || eventsLoading || applicationsLoading;

    if(isLoading) {
        return (
            <PageLoading />
        )
    }

    let processedApplicationList = applicationList
        .filter(FILTER_TYPES[activeCategory])
        .sort(SORT_TYPES[activeSortingMethod])

    return (
        <>
            <DashboardHeader>
                <DashboardTitle>
                    Søknader
                </DashboardTitle>
            </DashboardHeader>

            <InnerContainer extramargin border>
                <InnerContainerRow nopadding>
                    <InnerContainer flex="1">
                        <InnerContainerRow nopadding nowrap>
                            <InputContainer column mobileNoMargin>
                                <InputLabel small>Arrangement</InputLabel>
                                <InputSelect value={currentViewingEvent} onChange={updateViewingEvent}>
                                    {
                                        events.map((event) => (<option key={event.uuid} value={event.uuid}>{event.name} {event.uuid === currentEvent.uuid && "(Nåværende)" }</option>))
                                    }
                                </InputSelect>
                            </InputContainer>
                        </InnerContainerRow>
                    </InnerContainer>
                    <InnerContainer flex="1" mobileHide />
                    <InnerContainer flex="1" mobileHide />
                </InnerContainerRow>
                {
                    currentViewingEvent !== currentEvent.uuid && (<InnerContainerRow>
                    <p><i>Du kan se på søknader for dette arrangementet, men du kan ikke modifisere de siden det ikke er det nåværende arrangementet</i></p>
                    </InnerContainerRow>)
                }
            </InnerContainer>
            <InnerContainer mobileRowGap="4px">
                Sorter søknader etter:
                <InputContainer>
                    <InputElement name="1" type="radio" checked={activeSortingMethod === SORTING_METHODS.SURNAME} onClick={() => setActiveSortingMethod(SORTING_METHODS.SURNAME)} />
                    <InputLabel top="1px">Etternavn</InputLabel>
                </InputContainer>
                <InputContainer>
                    <InputElement name="1" type="radio" checked={activeSortingMethod === SORTING_METHODS.DATE} onClick={() => setActiveSortingMethod(SORTING_METHODS.DATE)} />
                    <InputLabel top="1px">Søknadstid</InputLabel>
                </InputContainer>
            </InnerContainer>

            <DashboardBarSelector border>
                <DashboardBarElement active={activeCategory == CATEGORIES.NO_ANSWER} onClick={() => setActiveCategory(CATEGORIES.NO_ANSWER)}>Ubehandlet</DashboardBarElement>
                <DashboardBarElement active={activeCategory == CATEGORIES.ACCEPTED} onClick={() => setActiveCategory(CATEGORIES.ACCEPTED)}>Godkjente</DashboardBarElement>
                <DashboardBarElement active={activeCategory == CATEGORIES.REJECTED} onClick={() => setActiveCategory(CATEGORIES.REJECTED)}>Avslått</DashboardBarElement>
                <DashboardBarElement active={activeCategory == CATEGORIES.HIDDEN} onClick={() => setActiveCategory(CATEGORIES.HIDDEN)}>Skjult</DashboardBarElement>
            </DashboardBarSelector>

            <DashboardContent >
                <InnerContainer>
                    <ApplicationTable showProcessedBy applications={processedApplicationList} />
                </InnerContainer>
            </DashboardContent>
        </>
    )
};

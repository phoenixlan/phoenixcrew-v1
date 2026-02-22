import React from 'react';
import { useHistory } from 'react-router-dom';

import { Table, TableCell, TableHead, SelectableTableRow, IconContainer, TableRow } from "../../../components/table";
import { PageLoading } from '../../../components/pageLoading';
import { InnerContainer } from '../../../components/dashboard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight }  from '@fortawesome/free-solid-svg-icons'
import { ApplicationCrewLabel } from '../../application/list';
import { useUserApplications } from '../../../hooks/useUser';

const stateToString = (state) => {
    if(state == "ApplicationState.rejected") {
        return "Avslått";
    }
    if(state == "ApplicationState.accepted") {
        return "Akseptert";
    }
    if(state == "ApplicationState.created") {
        return "Ingen svar";
    }
    return "Ukjent"
}

const ApplicationTableEntry = ({ application }) => {
    let history = useHistory();

    return (
        <SelectableTableRow key={application.uuid} onClick={e => {history.push(`/application/${application.uuid}`)}}>
            <TableCell flex="2" mobileHide>{application.event.name}</TableCell>
            <TableCell flex="3" ><ApplicationCrewLabel application_crew_mapping={application.crews[0]} /></TableCell>
            <TableCell flex="3" mobileHide>{application.crews.length > 1 ? (<ApplicationCrewLabel application_crew_mapping={application.crews[1]} />) : (<i>Ingen</i>)}</TableCell>
            <TableCell flex="3" mobileHide>{application.crews.length > 2 ? (<ApplicationCrewLabel application_crew_mapping={application.crews[2]} />) : (<i>Ingen</i>)}</TableCell>
            <TableCell flex="2" mobileHide>{stateToString(application.state)}</TableCell>
            <TableCell flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
        </SelectableTableRow>
    )
}

export const UserViewerApplications = ({ user }) => {
    const { data: applications = [], isLoading } = useUserApplications(user.uuid);

    if(isLoading) {
        return (<PageLoading />)
    }

    return (
        <>
            <InnerContainer extramargin>
                <Table>
                    <TableHead border>
                        <TableRow>
                            <TableCell as="th" flex="2" mobileHide>Arrangement</TableCell>
                            <TableCell as="th" flex="3">1. Valg</TableCell>
                            <TableCell as="th" flex="3" mobileHide>2. Valg</TableCell>
                            <TableCell as="th" flex="3" mobileHide>3. Valg</TableCell>
                            <TableCell as="th" flex="2" mobileHide>Status</TableCell>
                            <TableCell as="th" flex="0 24px" mobileHide><IconContainer/></TableCell>
                        </TableRow>
                    </TableHead>
                    <tbody>
                    {
                        applications.map((application) => <ApplicationTableEntry key={application.uuid} application={application}/>)
                    }
                    </tbody>
                </Table>
            </InnerContainer>
        </>
    )
}

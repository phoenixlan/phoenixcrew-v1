import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { User } from "@phoenixlan/phoenix.js";
import { Table, TableCell, TableHead, SelectableTableRow, IconContainer, TableRow } from "../../../components/table";
import { PageLoading } from '../../../components/pageLoading';
import { InnerContainer } from '../../../components/dashboard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight }  from '@fortawesome/free-solid-svg-icons'
import { ApplicationCrewLabel } from '../../application/list';

const ApplicationTableEntry = ({ application }) => {
    let history = useHistory();

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

export const UserViewerApplications = ({ user, reload: reloadUser }) => {
    const [ loading, setLoading ] = useState(false);

    const [ applications, setApplications ] = useState([]);

    const reload = async () => {
        setLoading(true);
        setApplications(await User.getApplications(user.uuid));
        setLoading(false);
    }

    useEffect(() => {
        reload();
    }, []);

    if(loading) {
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
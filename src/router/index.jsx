import React, { useContext } from 'react';
import { Router, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history';

import { Container } from "../container";

import { Login } from "../pages/login"
import { Dashboard } from "../pages/dashboard"
import { ViewUser} from "../pages/user/viewer"
import { ListApplications } from "../pages/application/list"

import { PrivateRoute } from "./privateRoute"
import { PublicRoute } from "./publicRoute"

import { AuthenticationContext } from '../components/authentication';
import { ViewApplication } from '../pages/application/view';
import { AgendaList } from '../pages/agenda';
import { PositionList } from '../pages/position';
import { CrewList } from '../pages/crew/list';
import { UserList } from '../pages/user/list';
import { SeatmapList } from '../pages/seatmap/listSeatmaps';
import { SeatmapEditor } from '../pages/seatmap/seatmapEditor';
import { FreeTicketManagement } from '../pages/ticket/freeTicketManagement';
import { TicketList } from '../pages/ticket/tickets';
import { MembershipList } from '../pages/ticket/membershipList';
import { EventList } from '../pages/event/list';
import { EventViewer } from '../pages/event/view';
import { AvatarApproval } from '../pages/avatar/approval';
import { StoreSessionList } from '../pages/ticket/storeSessions';
import { ViewPosition } from '../pages/position/view';
import { AgendaElementView } from '../pages/agenda/view';
import { NotAvailable } from '../pages/notAvailable';
import { ViewCrew } from '../pages/crew/view';

export const CrewRouter = () => {
    const auth = useContext(AuthenticationContext);

    const history = createBrowserHistory();
    return auth.loadingFinished ? (
        <Router history={history}>
            <Switch>
                <PublicRoute path="/login" component={Login} />
                <PrivateRoute path="/">
                    <Container>
                        <PrivateRoute exact path="/">
                            <Dashboard />
                        </PrivateRoute>
                        <PrivateRoute exact path="/logout" component={() => auth.logout()} />


                        <PrivateRoute exact path="/application/:uuid">
                            <ViewApplication />
                        </PrivateRoute>
                        <PrivateRoute exact path="/application/">
                            <ListApplications />
                        </PrivateRoute>
                        <PrivateRoute exact path="/positions/">
                            <PositionList />
                        </PrivateRoute>
                        <PrivateRoute exact path="/positions/:uuid">
                            <ViewPosition />
                        </PrivateRoute>
                        <PrivateRoute exact path="/avatar/approval/">
                            <AvatarApproval />
                        </PrivateRoute>
                        <PrivateRoute exact path="/crews/">
                            <CrewList />
                        </PrivateRoute>
                        <PrivateRoute exact path="/crew/:uuid">
                            <ViewCrew />
                        </PrivateRoute>
                        <PrivateRoute exact path="/seatmap/:uuid">
                            <SeatmapEditor />
                        </PrivateRoute>
                        <PrivateRoute exact path="/seatmap/">
                            <SeatmapList />
                        </PrivateRoute>
                        <PrivateRoute exact path="/event/:uuid">
                            <EventViewer />
                        </PrivateRoute>
                        <PrivateRoute exact path="/events/">
                            <EventList />
                        </PrivateRoute>
                        <PrivateRoute exact path="/users/">
                            <UserList/>
                        </PrivateRoute>
                        <PrivateRoute exact path="/user/:uuid">
                            <ViewUser />
                        </PrivateRoute>
                        <PrivateRoute exact path="/agenda/">
                            <AgendaList />
                        </PrivateRoute>
                        <PrivateRoute exact path="/agenda/:uuid">
                            <NotAvailable />
                        </PrivateRoute>
                        <PrivateRoute exact path="/tickets/">
                            <TicketList />
                        </PrivateRoute>
                        <PrivateRoute exact path="/tickets/memberships/">
                            <MembershipList/>
                        </PrivateRoute>
                        <PrivateRoute exact path="/tickets/free/">
                            <FreeTicketManagement />
                        </PrivateRoute>
                        <PrivateRoute exact path="/ticket/:uuid/">
                            <NotAvailable />
                        </PrivateRoute>
                        <PrivateRoute exact path="/store_sessions/">
                            <StoreSessionList/>
                        </PrivateRoute>
                    </Container>
                </PrivateRoute>
            </Switch>
        </Router>
    ) : (<h1>Loading</h1>);
}
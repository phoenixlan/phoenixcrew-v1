import React, { useContext } from 'react';
import { Router, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history';

import { Container } from "../container";

import { Login } from "../pages/login"
import { Dashboard } from "../pages/dashboard"
import { ViewUser} from "../pages/user/viewer"
import { ListApplications } from "../pages/application/list"
import { PageLoading } from "../components/pageLoading"

import { PrivateRoute } from "./privateRoute"
import { PublicRoute } from "./publicRoute"

import { AuthenticationContext } from '../components/authentication';
import { ViewApplication } from '../pages/application/view';
import { PositionList } from '../pages/position';
import { CrewList } from '../pages/crew/list';
import { CrewMemberList } from '../pages/crew/allMembers';
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
import { NotAvailable } from '../pages/notAvailable';
import { ViewCrew } from '../pages/crew/view';
import { EmailForm } from "../pages/utils/email";
import { TicketSalesStats } from "../pages/stats/ticketSales";
import { TicketVoucherManagement } from '../pages/ticket/ticketVoucherManagement';
import { AgendaList } from '../pages/information/agenda';
import { UserbaseStats } from '../pages/stats/userbase';
import { AgeDistributionStats } from '../pages/stats/ageDistribution';
import { EditUser } from '../pages/user/viewer/editUser';
import { CreatePosition } from '../pages/position/create';

export const CrewRouter = () => {
    const auth = useContext(AuthenticationContext);

    const history = createBrowserHistory();

    return auth.loadingFinished ? (
        <Router history={history}>
            <Switch>
                <PublicRoute path="/login">
                    <Login />
                </PublicRoute>
                <PrivateRoute path="/">
                    <Container>
                        <PrivateRoute exact path="/">
                            <Dashboard />
                        </PrivateRoute>
                        <PrivateRoute exact path="/logout">
                            {
                                () => auth.logout()
                            }
                        </PrivateRoute>
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
                        <PrivateRoute exact path="/position/create">
                            <CreatePosition />
                        </PrivateRoute>
                        <PrivateRoute exact path="/avatar/approval/">
                            <AvatarApproval />
                        </PrivateRoute>
                        <PrivateRoute exact path="/crews/">
                            <CrewList />
                        </PrivateRoute>
                        <PrivateRoute exact path="/crews/members/">
                            <CrewMemberList />
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
                        <PrivateRoute exact path="/email/">
                            <EmailForm/>
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
                        <PrivateRoute exact path="/user/:uuid/edit">
                            <EditUser />
                        </PrivateRoute>
                        <PrivateRoute exact path="/information/schedule/">
                            <AgendaList />
                        </PrivateRoute>
                        <PrivateRoute exact path="/information/schedule/:uuid">
                            <NotAvailable />
                        </PrivateRoute>
                        <PrivateRoute exact path="/stats/ticket_sales">
                            <TicketSalesStats />
                        </PrivateRoute>
                        <PrivateRoute exact path="/stats/userbase">
                            <UserbaseStats />
                        </PrivateRoute>
                        <PrivateRoute exact path="/stats/age_distribution">
                            <AgeDistributionStats />
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
                        <PrivateRoute exact path="/tickets/vouchers/">
                            <TicketVoucherManagement/>
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
    ) : (
        <PageLoading />
    );
}
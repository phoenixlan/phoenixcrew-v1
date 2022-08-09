import React, { useContext } from 'react';
import { Router, Switch, Route } from 'react-router-dom'
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
import { PositionAdmin } from '../pages/admin/position';
import { CrewList } from '../pages/crew/list';
import { UserList } from '../pages/user/list';
import { SeatmapList } from '../pages/seatmap/listSeatmaps';
import { SeatmapEditor } from '../pages/seatmap/seatmapEditor';
import { FreeTicketManagement } from '../pages/ticket/freeTicketManagement';
import { TicketList } from '../pages/ticket/tickets';

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
                        <PrivateRoute exact path="/user/:uuid">
                            <ViewUser />
                        </PrivateRoute>
                        <PrivateRoute exact path="/application/:uuid">
                            <ViewApplication />
                        </PrivateRoute>
                        <PrivateRoute exact path="/application/">
                            <ListApplications />
                        </PrivateRoute>
                        <PrivateRoute exact path="/positions/">
                            <PositionAdmin />
                        </PrivateRoute>
                        <PrivateRoute exact path="/crews/">
                            <CrewList />
                        </PrivateRoute>
                        <PrivateRoute exact path="/seatmap/:uuid">
                            <SeatmapEditor />
                        </PrivateRoute>
                        <PrivateRoute exact path="/seatmap/">
                            <SeatmapList />
                        </PrivateRoute>
                        <PrivateRoute exact path="/users/">
                            <UserList/>
                        </PrivateRoute>
                        <PrivateRoute exact path="/agenda/">
                            <AgendaList />
                        </PrivateRoute>
                        <PrivateRoute exact path="/ticket/">
                            <TicketList />
                        </PrivateRoute>
                        <PrivateRoute exact path="/ticket/free/">
                            <FreeTicketManagement />
                        </PrivateRoute>
                    </Container>
                </PrivateRoute>
            </Switch>
        </Router>
    ) : (<h1>Loading</h1>);
}
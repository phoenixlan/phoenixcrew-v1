import React, { useContext, useEffect } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";

import { Container } from "../container";
import { Authentication, AuthenticationContext } from "../components/authentication";
import { PageLoading } from "../components/pageLoading";
import { Brand } from "../contexts/brand";
import { EventBrands, EventBrandsContext } from "../contexts/eventBrands";
import { Login } from "../pages/login";
import { Dashboard } from "../pages/dashboard";
import { ViewUser } from "../pages/user/viewer";
import { EditUser } from "../pages/user/viewer/editUser";
import { UserSearch } from "../pages/user/search";
import { AvatarApproval } from "../pages/avatar/approval";
import { EventBrandList } from "../pages/eventBrand";
import { ListApplications } from "../pages/application/list";
import { ViewApplication } from "../pages/application/view";
import { PositionList } from "../pages/position";
import { ViewPosition } from "../pages/position/view";
import { CreatePosition } from "../pages/position/create";
import { CrewList } from "../pages/eventBrand/crew/list";
import { CrewMemberList } from "../pages/crew/allMembers";
import { ViewCrew } from "../pages/crew/view";
import { SeatmapList } from "../pages/seatmap/listSeatmaps";
import { SeatmapEditor } from "../pages/seatmap/seatmapEditor";
import { FreeTicketManagement } from "../pages/ticket/freeTicketManagement";
import { TicketList } from "../pages/ticket/tickets";
import { TicketSalesStatus } from "../pages/ticket/ticketSalesStatus";
import { MembershipList } from "../pages/ticket/membershipList";
import { TicketVoucherManagement } from "../pages/ticket/ticketVoucherManagement";
import { ViewTicket } from "../pages/ticket/viewer";
import { TicketTypeList } from "../pages/ticket/ticketTypes";
import { StoreSessionList } from "../pages/ticket/storeSessions";
import { EventList } from "../pages/event/list";
import { CreateEvent } from "../pages/event/create";
import { EventViewer } from "../pages/event/view";
import { EmailForm } from "../pages/utils/email";
import { TicketSalesStats } from "../pages/stats/ticketSales";
import { UserbaseStats } from "../pages/stats/userbase";
import { AgeDistributionStats } from "../pages/stats/ageDistribution";
import { AgendaList } from "../pages/information/agenda";
import { CreateAgendaEntry } from "../pages/information/agenda/create";
import { EditAgendaEntry } from "../pages/information/agenda/view";
import { PublicRoute } from "./publicRoute";
import { isGlobalAdmin } from "../utils/roles";

const Logout = () => {
    const auth = useContext(AuthenticationContext);
    useEffect(() => auth.logout(), [auth]);
    return <PageLoading title="Logger ut" detail="Vennligst vent …" />;
};

const NotFound = () => <><h1>Siden finnes ikke</h1><p>Kontroller at du har tilgang til denne merkevaren.</p></>;

const BrandRoutes = () => (
    <Brand>
        <Switch>
            <Route exact path="/brand/:brandUuid/"><Dashboard /></Route>
            <Route exact path="/brand/:brandUuid/application/:uuid"><ViewApplication /></Route>
            <Route exact path="/brand/:brandUuid/application/"><ListApplications /></Route>
            <Route exact path="/brand/:brandUuid/positions/"><PositionList /></Route>
            <Route exact path="/brand/:brandUuid/positions/:uuid"><ViewPosition /></Route>
            <Route exact path="/brand/:brandUuid/position/create"><CreatePosition /></Route>
            <Route exact path="/brand/:brandUuid/crews/"><CrewList /></Route>
            <Route exact path="/brand/:brandUuid/crews/members/"><CrewMemberList /></Route>
            <Route exact path="/brand/:brandUuid/crew/:uuid"><ViewCrew /></Route>
            <Route exact path="/brand/:brandUuid/seatmap/:uuid"><SeatmapEditor /></Route>
            <Route exact path="/brand/:brandUuid/seatmap/"><SeatmapList /></Route>
            <Route exact path="/brand/:brandUuid/email/"><EmailForm /></Route>
            <Route exact path="/brand/:brandUuid/events/"><EventList /></Route>
            <Route exact path="/brand/:brandUuid/event/create"><CreateEvent /></Route>
            <Route exact path="/brand/:brandUuid/event/:uuid"><EventViewer /></Route>
            <Route exact path="/brand/:brandUuid/information/schedule/"><AgendaList /></Route>
            <Route exact path="/brand/:brandUuid/information/schedule/create/"><CreateAgendaEntry /></Route>
            <Route exact path="/brand/:brandUuid/information/schedule/:uuid"><EditAgendaEntry /></Route>
            <Route exact path="/brand/:brandUuid/stats/ticket_sales"><TicketSalesStats /></Route>
            <Route exact path="/brand/:brandUuid/stats/userbase"><UserbaseStats /></Route>
            <Route exact path="/brand/:brandUuid/stats/age_distribution"><AgeDistributionStats /></Route>
            <Route exact path="/brand/:brandUuid/tickets/"><TicketList /></Route>
            <Route exact path="/brand/:brandUuid/tickets/sales-status/"><TicketSalesStatus /></Route>
            <Route exact path="/brand/:brandUuid/tickets/memberships/"><MembershipList /></Route>
            <Route exact path="/brand/:brandUuid/tickets/free/"><FreeTicketManagement /></Route>
            <Route exact path="/brand/:brandUuid/tickets/vouchers/"><TicketVoucherManagement /></Route>
            <Route exact path="/brand/:brandUuid/ticket/:id/"><ViewTicket /></Route>
            <Route exact path="/brand/:brandUuid/ticket-types/"><TicketTypeList /></Route>
            <Route exact path="/brand/:brandUuid/store_sessions/"><StoreSessionList /></Route>
            <Route><NotFound /></Route>
        </Switch>
    </Brand>
);

const AuthenticatedApp = () => {
    const auth = useContext(AuthenticationContext);
    const { brands, loading, error, refetch } = useContext(EventBrandsContext);
    if(loading) return <PageLoading showLogo title="Laster Phoenix EMS" detail="Henter merkevarer og aktive arrangementer …" />;
    if(error) return <div><h1>Kunne ikke laste Phoenix EMS</h1><p>{error.message}</p><button onClick={refetch}>Prøv igjen</button></div>;

    return (
        <Container>
            <Switch>
                <Route exact path="/"><Dashboard /></Route>
                <Route exact path="/logout"><Logout /></Route>
                <Route exact path="/user_search/">{isGlobalAdmin(auth.roles) ? <UserSearch/> : <NotFound />}</Route>
                <Route exact path="/user/:uuid/edit"><EditUser /></Route>
                <Route exact path="/user/:uuid"><ViewUser /></Route>
                <Route exact path="/avatar/approval/">{isGlobalAdmin(auth.roles) ? <AvatarApproval /> : <NotFound />}</Route>
                <Route exact path="/event-brands/">{isGlobalAdmin(auth.roles) ? <EventBrandList /> : <NotFound />}</Route>
                <Route path="/brand/:brandUuid" render={({ match }) => (
                    brands.some(brand => brand.uuid === match.params.brandUuid) ? <BrandRoutes /> : <NotFound />
                )} />
                <Route><NotFound /></Route>
            </Switch>
        </Container>
    );
};

const RouterInner = () => {
    const auth = useContext(AuthenticationContext);
    if(!auth.loadingFinished) return <PageLoading showLogo title="Logger inn" detail="Kontrollerer innloggingen din …" />;

    return (
        <Switch>
            <PublicRoute path="/login"><Login /></PublicRoute>
            <Route path="/" render={() => auth.authUser ? <AuthenticatedApp /> : <Redirect to="/login" />} />
        </Switch>
    );
};

export const CrewRouter = () => {
    const history = createBrowserHistory();
    return (
        <Router history={history}>
            <Authentication>
                <EventBrands>
                    <RouterInner />
                </EventBrands>
            </Authentication>
        </Router>
    );
};

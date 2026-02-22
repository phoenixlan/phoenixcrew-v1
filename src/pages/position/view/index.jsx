import React , { useContext, useState } from "react";

import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow } from '../../../components/dashboard';

import { useParams } from "react-router-dom";
import { PositionMemberList } from "./memberList";
import { PositionPermissionList } from "./permissionList";
import { PositionDetails } from "./details";
import { AuthenticationContext } from "../../../components/authentication";
import { Notice } from "../../../components/containers/notice";
import { PageLoading } from "../../../components/pageLoading";
import { usePosition } from "../../../hooks/usePosition";
import { useCurrentEvent } from "../../../hooks/useEvent";


export const ViewPosition = (props) => {
    const { uuid } = useParams();
    const [activeContent, setActiveContent] = useState(1);

    const authContext = useContext(AuthenticationContext);

    const { data: position, isLoading: positionLoading, error, refetch } = usePosition(uuid);
    const { data: currentEvent, isLoading: eventLoading } = useCurrentEvent();

    const isLoading = positionLoading || eventLoading;

    if(isLoading) {
        return (<PageLoading />)
    } else if(authContext.roles.includes("admin") || authContext.roles.includes("hr_admin")) {
        if(position) {
            const usersForCurrentEvent = currentEvent ? position.position_mappings.filter((user) => (!user.event_uuid || user.event_uuid == currentEvent.uuid)) : [];
            return (
                <>
                    <DashboardHeader>
                        <DashboardTitle>
                            Stilling
                        </DashboardTitle>
                        <DashboardSubtitle>
                            {position.name}
                        </DashboardSubtitle>
                    </DashboardHeader>

                    <DashboardBarSelector border>
                        <DashboardBarElement active={activeContent == 1} onClick={() => setActiveContent(1)}>Generelt</DashboardBarElement>
                        <DashboardBarElement active={activeContent == 2} onClick={() => setActiveContent(2)}>Rettigheter ({position.permissions.length})</DashboardBarElement>
                        <DashboardBarElement active={activeContent == 3} onClick={() => setActiveContent(3)}>Medlemmer {currentEvent ? ("("+ usersForCurrentEvent.length + ")") : null}</DashboardBarElement>
                    </DashboardBarSelector>

                    <DashboardContent visible={activeContent == 1}>
                        <PositionDetails position={position} />
                    </DashboardContent>

                    <DashboardContent visible={activeContent == 2}>
                        <PositionPermissionList position={position} />
                    </DashboardContent>

                    <DashboardContent visible={activeContent == 3} nopadding>
                        <PositionMemberList position={position} refresh={refetch}/>
                    </DashboardContent>
                </>
            )
        } else {
            return (
                <>
                    <DashboardHeader border>
                        <DashboardTitle>
                            Stilling
                        </DashboardTitle>
                    </DashboardHeader>

                    <DashboardContent>
                        <Notice type="error" visible>
                            Det oppsto en feil ved henting av informasjon for denne stillingen.<br />
                            {error?.message}
                        </Notice>
                    </DashboardContent>
                </>
            )
        }
    } else {
        return (
            <>
                <DashboardContent>
                    <InnerContainer rowgap>
                        <InnerContainerRow>
                            <Notice type="error" visible>
                                Du har ikke tilgang til å se denne stillingen.
                            </Notice>
                        </InnerContainerRow>
                    </InnerContainer>
                </DashboardContent>
            </>
            )
    }
}

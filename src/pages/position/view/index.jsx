import React , { useContext, useEffect, useState } from "react";

import { Position} from "@phoenixlan/phoenix.js";

import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, IFrameContainer, InnerTableCell, InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputDate, InputElement, InputLabel, InputText } from '../../../components/dashboard';

import { useParams } from "react-router-dom";
import { PositionMemberList } from "./memberList";
import { PositionPermissionList } from "./permissionList";
import { PositionDetails } from "./details";
import { AuthenticationContext } from "../../../components/authentication";
import { Notice } from "../../../components/containers/notice";
import { PageLoading } from "../../../components/pageLoading";


export const ViewPosition = (props) => {
    const { uuid } = useParams();
    const [error, setError] = useState(false);
    const [position, setPosition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visibleUUID, setVisibleUUID] = useState(false);
    const [activeContent, setActiveContent] = useState(1);

    // Import the following React contexts:
    const loggedinUser = useContext(AuthenticationContext);

    const load = async () => {
        setLoading(true);

        // Get position based on UUID and return error if something fails.
        try {
            const position = await Position.getPosition(uuid);
            setPosition(position);
        } catch(e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load().catch(e => { 
            console.log(e);
        })
    }, []);

    if(loading) {
        return (<PageLoading />)
    } else if(loggedinUser.roles.includes("admin") || loggedinUser.roles.includes("hr_admin")) {
        if(position) {
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
                        <DashboardBarElement active={activeContent == 3} onClick={() => setActiveContent(3)}>Medlemmer ({position.position_mappings.length})</DashboardBarElement>
                    </DashboardBarSelector>

                    <DashboardContent visible={activeContent == 1}>
                        <PositionDetails position={position} />
                    </DashboardContent>

                    <DashboardContent visible={activeContent == 2}>
                        <PositionPermissionList position={position} />
                    </DashboardContent>

                    <DashboardContent visible={activeContent == 3} nopadding>
                        <PositionMemberList position={position} refresh={load}/>
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
                            {error.message}
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
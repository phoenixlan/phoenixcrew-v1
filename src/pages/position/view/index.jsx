import React , { useEffect, useState } from "react";

import { Position} from "@phoenixlan/phoenix.js";

import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, IFrameContainer, InnerTableCell, InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputDate, InputElement, InputLabel, InputText } from '../../../components/dashboard';

import { useParams } from "react-router-dom";
import { PositionMemberList } from "./memberList";
import { PositionPermissionList } from "./permissionList";


export const ViewPosition = (props) => {

    const { uuid } = useParams();
    const [error, setError] = useState(false);
    const [position, setPosition] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleUUID, setVisibleUUID] = useState(false);
    const [activeContent, setActiveContent] = useState(1);

    const load = async () => {
        setLoading(true);

        // Get position based on UUID and return error if something fails.
        try {
            const position = await Position.getPosition(uuid);
            setPosition(position);
            setLoading(false);
        } catch(e) {
            setError(e);
        }
    }

    useEffect(() => {
        load().catch(e => { 
            console.log(e);
        })
    }, []);

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
            {
                error ? 
                    <>
                        Det oppsto en feil ved henting av informasjon for denne stillingen.
                    </>
                : loading ? "vent... " :
                    <>
                        <DashboardBarSelector border>
                            <DashboardBarElement active={activeContent == 1} onClick={() => setActiveContent(1)}>Generelt</DashboardBarElement>
                            <DashboardBarElement active={activeContent == 2} onClick={() => setActiveContent(2)}>Rettigheter ({position.permissions.length})</DashboardBarElement>
                            <DashboardBarElement active={activeContent == 3} onClick={() => setActiveContent(3)}>Medlemmer ({position.position_mappings.length})</DashboardBarElement>
                        </DashboardBarSelector>

                        <DashboardContent visible={activeContent == 1}>
                            <InnerContainer>
                                
                            </InnerContainer>
                        </DashboardContent>

                        <DashboardContent visible={activeContent == 2}>
                            <PositionPermissionList position={position} />
                        </DashboardContent>

                        <DashboardContent visible={activeContent == 3}>
                            <PositionMemberList position={position} refresh={load}/>
                        </DashboardContent>
                </>
            }
        </>
    )
}
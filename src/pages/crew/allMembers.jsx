import React , { useEffect, useState } from "react";
import { Crew } from "@phoenixlan/phoenix.js";
import { PageLoading } from "../../components/pageLoading"
import { faArrowRight, faCheck, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InnerContainerTitleS} from "../../components/dashboard";
import { Table, TableCell, CrewColorBox, IconContainer, SelectableTableRow, TableHead, TableRow } from "../../components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../components/button"
import { useHistory } from "react-router-dom";
import { SimpleUserCard } from "../../components/simpleUserCard";

import styled from "styled-components";
import { Theme } from "../../theme";

const S = {
    CrewList: styled.div`
    display: flex;
    flex-wrap: wrap;
    `,
    CrewMember: styled.div`
        border: 1px solid;
        padding: 1em;
        width: 20em;
    `,
    CrewAvatar: styled.img`
        max-width: 9em;
    `,
}

export const CrewMemberList= () => {
    const [crews, setCrews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleUUID, setVisibleUUID] = useState(false);

    let history = useHistory();

    useEffect(async () => {
        const crews = await Promise.all((await Crew.getCrews())
            .filter(crew => crew.active)
            .map(async (crew) => {
                return await Crew.getCrew(crew.uuid);
            })
        )
        setCrews(crews);
        setLoading(false);
    }, []);

    if(loading) {
        return (
            <PageLoading />
        )
    }

    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Alle crewmedlemmer
                </DashboardTitle>
                <DashboardSubtitle>
                    Viser {crews.length} aktive crew
                </DashboardSubtitle>
            </DashboardHeader>
            <DashboardContent>
                <InnerContainer>
                    {
                        crews.map((crew) => {
                            const crewMembersMap = new Map();
                            crew.positions.forEach((position) => {
                                position.position_mappings.map(mapping => mapping.user).forEach((user) => {
                                    if(!crewMembersMap.has(user.uuid)) {
                                        crewMembersMap.set(user.uuid, user)
                                    }
                                })
                            })

                            const crewMembers = Array.from(crewMembersMap.values());
                            console.log(crewMembers)

                            return (
                                <>
                                    <InnerContainerTitle nopadding>{crew.name}</InnerContainerTitle>
                                    <p><i>{crewMembers.length} medlemmer</i></p>
                                    <InnerContainerRow>
                                        {
                                            crewMembers.map(member => (<SimpleUserCard user={member} key={member.uuid} />))
                                        }
                                    </InnerContainerRow>
                                        <Button color={Theme.Passive} onClick={e => {history.push(`/crew/${crew.uuid}`)}}>Se crew</Button>
                                </>
                            )
                        })
                    } 
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
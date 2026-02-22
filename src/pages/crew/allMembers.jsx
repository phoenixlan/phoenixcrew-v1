import React from "react";
import { Crew, getCurrentEvent } from "@phoenixlan/phoenix.js";
import { PageLoading } from "../../components/pageLoading"
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle } from "../../components/dashboard";
import { Button } from "../../components/button"
import { useHistory } from "react-router-dom";
import { SimpleUserCard } from "../../components/simpleUserCard";
import { useQuery } from "react-query";

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
    let history = useHistory();

    const { data: crews = [], isLoading } = useQuery(['allCrewMembers'], async () => {
        const event = await getCurrentEvent();
        const crewList = await Crew.getCrews();
        return Promise.all(
            crewList
                .filter(crew => crew.active)
                .map(async (base_crew) => {
                    const crew = await Crew.getCrew(base_crew.uuid);

                    const crewMembersMap = new Map();
                    crew.positions.forEach((position) => {
                        position.position_mappings.filter((position_mapping => position_mapping.event_uuid === null || position_mapping.event === event.uuid)).map(mapping => mapping.user).forEach((user) => {
                            if(!crewMembersMap.has(user.uuid)) {
                                crewMembersMap.set(user.uuid, user)
                            }
                        })
                    })

                    const crewMembers = Array.from(crewMembersMap.values());
                    console.log(crewMembers)

                    return {
                        name: crew.name,
                        uuid: crew.uuid,
                        members: crewMembers
                    }
                })
        );
    });

    if(isLoading) {
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
                            return (
                                <>
                                    <InnerContainerTitle nopadding>{crew.name}</InnerContainerTitle>
                                    <p><i>{crew.members.length} medlemmer</i></p>
                                    <InnerContainerRow>
                                        {
                                            crew.members.map(member => (<SimpleUserCard user={member} key={member.uuid} />))
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

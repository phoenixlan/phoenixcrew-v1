import React , { useEffect, useState } from "react";

import { Crew, getCurrentEvent } from "@phoenixlan/phoenix.js";
import { PageLoading } from "../../components/pageLoading"
import { SimpleUserCard } from "../../components/simpleUserCard";
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputElement, InputLabel, InputTextArea } from "../../components/dashboard";
import { Column, Table, TableHeader } from "../../components/table";
import { useParams } from "react-router-dom";

export const ViewCrew = () => {
    const { uuid } = useParams();
    const [ activeContent, setActiveContent ] = useState(1);
    const [ loading, setLoading ] = useState(true);
    const [ crew, setCrew ] = useState();
    const [ currentEvent, setCurrentEvent ] = useState();

    useEffect(async () => {
        try {
            const [ crew, currentEvent ] = await Promise.all([
                await Crew.getCrew(uuid),
                await getCurrentEvent()
            ])
            setCrew(crew);
            setCurrentEvent(currentEvent)
            setLoading(false);
        } catch(e) {
            return (
                <p>En feil oppsto</p>
            )
        }
        
    }, []);

    const currentEventFilter = (position_mapping) => !position_mapping.event || position_mapping.event.uuid == currentEvent.uuid;

    if(loading) {
        return (
            <PageLoading />
        )
    }
    else {
        const memberMap = new Map();
        const chiefMap  = new Map();
        crew.positions.forEach((position) => {
            if(position.chief) {
                position.position_mappings.filter(currentEventFilter).forEach((mapping) => {
                    const user = mapping.user
                    if(!chiefMap.has(user.uuid)) {
                        chiefMap.set(user.uuid, user);
                    }
                })
            }
            position.position_mappings.filter(currentEventFilter).forEach((mapping) => {
                const user = mapping.user
                if(!memberMap.has(user.uuid)) {
                    memberMap.set(user.uuid, user);
                }
            })
        })
        const leaders = Array.from(chiefMap.values());
        const members = Array.from(memberMap.values());
        console.log(members);


        return (
            <>
                <DashboardHeader>
                    <DashboardTitle>
                        Crew
                    </DashboardTitle>
                    <DashboardSubtitle>
                        {crew.name}
                    </DashboardSubtitle>
                </DashboardHeader>

                <DashboardBarSelector border>
                    <DashboardBarElement active={activeContent == 1} onClick={() => setActiveContent(1)}>Generelt</DashboardBarElement>
                    <DashboardBarElement active={activeContent == 2} onClick={() => setActiveContent(2)}>Medlemmer ({members.length})</DashboardBarElement>
                </DashboardBarSelector>

                <DashboardContent visible={activeContent == 1}>
                    <InnerContainer>
                        <InnerContainerRow>
                            <InnerContainer flex="1">
                                <form>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Navn</InputLabel>
                                        <InputElement type="text" value={crew.name} disabled />
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Beskrivelse</InputLabel>
                                        <InputTextArea type="text" value={crew.description} disabled />
                                    </InputContainer>
                                </form>
                            </InnerContainer>
                            <InnerContainer flex="1" />
                        </InnerContainerRow>
                    </InnerContainer>
                </DashboardContent>

                <DashboardContent visible={activeContent == 2}>
                    <InnerContainer>
                        <Table>
                            <TableHeader>
                                <Column flex="1">Gruppeledere{currentEvent.name}</Column>
                            </TableHeader>
                        </Table>
                        <InnerContainerRow>
                        {
                            leaders.map(user => (<SimpleUserCard user={user} key={user.uuid} />))
                        }
                        </InnerContainerRow>
                        <p><i>{leaders.length} gruppeledere</i></p>
                        <Table>
                            <TableHeader>
                                <Column flex="1">Medlemmer({currentEvent.name})</Column>
                            </TableHeader>
                        </Table>
                        <InnerContainerRow>
                        {
                            members.map(user => (<SimpleUserCard user={user} key={user.uuid} />))
                        }
                        </InnerContainerRow>
                        <p><i>{members.length} medlemmer</i></p>
                        
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
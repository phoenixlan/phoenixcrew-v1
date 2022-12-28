import React , { useEffect, useState } from "react";
import styled from "styled-components";

import { Crew } from "@phoenixlan/phoenix.js";
import { PageLoading } from "../../components/pageLoading"
import { SimpleUserCard } from "../../components/simpleUserCard";
import { faArrowRight, faCheck, faPen, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputElement, InputLabel, InputTextArea } from "../../components/dashboard";
import { Column, CrewColorBox, IconContainer, SelectableRow, Table, TableHeader, TableRow } from "../../components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory, useParams } from "react-router-dom";

export const ViewCrew = () => {
    const { uuid } = useParams();
    const [activeContent, setActiveContent] = useState(1);
    const [ loading, setLoading ] = useState(true);
    const [ crew, setCrew ] = useState();

    useEffect(async () => {
        try {
            setCrew(await Crew.getCrew(uuid));
            setLoading(false);
        } catch(e) {
            return (
                <p>En feil oppsto</p>
            )
        }
        
    }, []);


    


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
                position.users.forEach((user) => {
                    if(!chiefMap.has(user.uuid)) {
                        chiefMap.set(user.uuid, user);
                    }
                })
            }
            position.users.forEach((user) => {
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
                        { leaders.length 
                            ?
                                <>
                                    <Table>
                                        <TableHeader>
                                            <Column flex="1">Gruppeledere</Column>
                                        </TableHeader>
                                    </Table>
                                    <InnerContainerRow>
                                    
                                    {
                                        leaders.map(user => (<SimpleUserCard user={user} key={user.uuid} />))
                                    }
                                    </InnerContainerRow>
                                </>
                            :
                                <>
                                </>
                        }
                        { members.length
                            ?
                                <>
                                    <Table>
                                        <TableHeader>
                                            <Column flex="1">Medlemmer</Column>
                                        </TableHeader>
                                    </Table>
                                    <InnerContainerRow>
                                        
                                        {
                                            members.map(user => (<SimpleUserCard user={user} key={user.uuid} />))
                                        }
                                    </InnerContainerRow>
                                </>
                            :
                                <>
                                    Ingen medlemmer registert.
                                </>
                        }
                        
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
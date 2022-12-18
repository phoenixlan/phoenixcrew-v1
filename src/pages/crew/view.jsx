import React , { useEffect, useState } from "react";
import styled from "styled-components";

import { Crew } from "@phoenixlan/phoenix.js";
import { PageLoading } from "../../components/pageLoading"
import { SimpleUserCard } from "../../components/simpleUserCard";
import { faArrowRight, faCheck, faPen, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InputCheckbox } from "../../components/dashboard";
import { Table } from "@material-ui/core";
import { Column, CrewColorBox, IconContainer, SelectableRow, TableHeader, TableRow } from "../../components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory, useParams } from "react-router-dom";

export const ViewCrew = () => {
    const { uuid } = useParams();
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
        crew.positions.forEach((position) => {
            if(position.chief) {
                // Hent ut gruppeledere
            }
            position.users.forEach((user) => {
                if(!memberMap.has(user.uuid)) {
                    memberMap.set(user.uuid, user);
                }
            })
        })
        const members = Array.from(memberMap.values());
        console.log(members);


        return (
            <>
                <DashboardHeader border>
                    <DashboardTitle>
                        Crew oversikt
                    </DashboardTitle>
                    <DashboardSubtitle>
                        {crew.name}
                    </DashboardSubtitle>
                </DashboardHeader>
                <DashboardContent>
                    <InnerContainer>
                    </InnerContainer>

                    <InnerContainer>
                        <Table>
                            <TableRow>
                                <Column>Gruppeleder: </Column>
                                <Column>{}</Column>
                            </TableRow>
                            <TableRow>
                                <Column>{crew.description}</Column>
                            </TableRow>
                        </Table>
                    </InnerContainer>
                    <InnerContainer>
                        {
                            members.map(user => (<SimpleUserCard user={user} key={user.uuid}/>))
                        }
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
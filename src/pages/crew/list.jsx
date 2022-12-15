import React , { useEffect, useState } from "react";
import styled from "styled-components";

import { Crew } from "@phoenixlan/phoenix.js";
import { PageLoading } from "../../components/pageLoading"
import { SimpleUserCard } from "../../components/simpleUserCard";
import { faArrowRight, faCheck, faPen, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InputCheckbox } from "../../components/dashboard";
import { Table } from "@material-ui/core";
import { Column, CrewColorBox, IconContainer, SelectableRow, TableHeader } from "../../components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";

const S = {
    Crew: styled.div`
    
    `,
    UserContainer: styled.div`
    display: flex;
    flex-wrap: wrap;
    `
}

export const CrewList= () => {
    const [crews, setCrews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleUUID, setVisibleUUID] = useState(false);

    let history = useHistory();

    useEffect(async () => {
        const crews = await Promise.all((await Crew.getCrews()).map(async (crew) => {
            return await Crew.getCrew(crew.uuid);
        }))
        setCrews(crews);
        setLoading(false);
    }, []);
    if(loading) {
        return (<PageLoading />)
    }

    return(
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Crew
                </DashboardTitle>
                <DashboardSubtitle>
                    {crews.length} crew registrert
                </DashboardSubtitle>
            </DashboardHeader>
            <DashboardContent>
                <InnerContainer>
                    <InputCheckbox label="Vis crew UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                </InnerContainer>

                <InnerContainer>
                    <Table>
                        <TableHeader border>
                            <Column flex="10" visible={!visibleUUID}>UUID</Column>
                            <Column flex="0 42px">Farge</Column>
                            <Column flex="6">Navn</Column>
                            <Column flex="10">Beskrivelse</Column>
                            <Column flex="3">Antall<br/>brukere</Column>
                            <Column center flex="0 24px" title="Statusikon: Ikon vises om crewet kan søkes til eller ikke"><IconContainer>...</IconContainer></Column>
                            <Column center flex="0 24px" title="Statusikon: Ikon vises om crewet er aktivt eller ikke."><IconContainer>...</IconContainer></Column>
                            <Column center flex="0 24px" title="Trykk for å åpne"><IconContainer>...</IconContainer></Column>
                        </TableHeader>
                        {
                            crews.map((crew) => {
                                return (
                                <SelectableRow onClick={e => {history.push(`/crew/${crew.uuid}`)}} active={!crew.active}>
                                    <Column consolas flex="10" visible={!visibleUUID}>{ crew.uuid }</Column>
                                    <Column flex="0 42px"><CrewColorBox hex={crew.hex_color} /></Column>
                                    <Column flex="6">{ crew.name }</Column>
                                    <Column flex="10">{ crew.description }</Column>
                                    <Column flex="3">...</Column>
                                    <Column flex="0 24px"><IconContainer><FontAwesomeIcon icon={crew.is_applyable ? faUserPlus : ""} /></IconContainer></Column>
                                    <Column flex="0 24px"><IconContainer><FontAwesomeIcon icon={crew.active ? faCheck : ""}/></IconContainer></Column>
                                    <Column flex="0 24px"><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                                </SelectableRow>)
                            })
                        }
                    </Table>
                </InnerContainer>
            </DashboardContent>
        </>
    )


    return (<div>
        <h1>Crew</h1>
        {
            crews.map((crew) => {
                const memberMap = new Map();
                crew.positions.forEach((position) => {
                    position.users.forEach((user) => {
                        if(!memberMap.has(user.uuid)) {
                            memberMap.set(user.uuid, user)
                        }
                    })
                })
                const members = Array.from(memberMap.values());
                console.log(members)
                return (<S.Crew>
                    <h1>{crew.name}</h1>
                    <p>{crew.description}</p>
                    <p>{crew.teams.length} shift</p>
                    <S.UserContainer>
                        {
                            members.map(user => (<SimpleUserCard user={user} key={user.uuid}/>))
                        }
                    </S.UserContainer>
                    <p><i>{members.length} medlemmer</i></p>
                    </S.Crew>)
            })
        }
        </div>)
}
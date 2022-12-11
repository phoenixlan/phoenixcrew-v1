import React , { useEffect, useState } from "react";
import styled from "styled-components";

import { Position, Crew } from "@phoenixlan/phoenix.js";

import { Column, IconContainer, InnerColumnCenter, SelectableRow, Table, TableHeader } from '../../components/table';
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, IFrameContainer, InnerColumn, InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputDate, InputElement, InputLabel, InputText } from '../../components/dashboard';
import { PageLoading } from "../../components/pageLoading"

import { Button } from "../../components/button"

import { Theme } from "../../theme";
import { SimpleUserCard } from "../../components/simpleUserCard";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";

const S = {
    Role: styled.div`
    
    `,
    UserContainer: styled.div`
    display: flex;
    flex-wrap: wrap;
    `,
}

export const PositionAdmin = () => {

    const [roles, setRoles] = useState([]);
    const [crews, setCrews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleUUID, setVisibleUUID] = useState(false);

    let history = useHistory();

    useEffect(() => {
        const initialise = async () => {
            setLoading(true);

            try {
                const positions = Promise.all(await Position.getPositions()).map(position => Position.getPosition(position.uuid));
                if(positions) {
                    setRoles(positions);
                }
            } catch(e) {
                console.error("404 ERROR!!!!!!!!!!!!!!");
            }
        }
    }, []);

    useEffect(async () => {
        const [ positions, crews ] = await Promise.all([
            Promise.all(
                (await Position.getPositions()).map(position => Position.getPosition(position.uuid))
            ),
            Promise.all(
                (await Crew.getCrews()).map(crew => Crew.getCrew(crew.uuid))
            )
        ])

        setCrews(crews);
        setRoles(positions);

        setLoading(false);
    }, []);


    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Stillinger og rettigheter
                </DashboardTitle>
                <DashboardSubtitle>
                    {roles.length} stillinger er aktive
                </DashboardSubtitle>
            </DashboardHeader>
            <DashboardContent>
                <InnerContainer>
                    Stillinger er hvordan brukere tilhører crew, og hvordan brukere får rettigheter på nettsidene til Phoenix.<br />
                    En bruker kan ha flere stillinger og trenger ikke å bety at man tilhører et crew.
                </InnerContainer>
                <InnerContainer>
                    <InputCheckbox label="Vis stilling UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                </InnerContainer>

                <InnerContainer>
                    <Table>
                        <TableHeader border>
                            <Column flex="9" visible={!visibleUUID}>UUID</Column>
                            <Column flex="4">Tilknyttet <br/>crew</Column>
                            <Column flex="9">Navn</Column>
                            <Column flex="2">Type</Column>
                            <Column flex="2">Antall <br/>brukere</Column>
                            <Column flex="2">Antall <br/>rettigheter</Column>
                            <Column flex="0 24px" />
                        </TableHeader>
                        {
                            roles.map((role) => {
                                const roleCrew = crews.find((crew) => crew.uuid == role.crew_uuid)
                                const roleTeam = roleCrew?.teams.find((team) => team.uuid == role.team_uuid)


                                let name = (role.chief ? "Gruppeleder for " : "Medlemmer av ") + (roleTeam ? ` ${roleTeam.name} ` : " ") + (roleCrew?.name ?? "Ukjent crew");
                                if(role.name) {
                                    name = `${role.name}${roleCrew ? " (" + name + ")":""}`
                                }


                                if(loading) {

                                } else {
                                    return (
                                        <SelectableRow title="Trykk for å åpne" onClick={e => {history.push(`/positions/${role.uuid}`)}}>
                                            <Column consolas flex="9" visible={!visibleUUID}>{role.uuid}</Column>
                                            <Column flex="4">{(roleCrew?.name ?? "-")}</Column>
                                            <Column flex="9">{name}</Column>
                                            <Column flex="2"></Column>
                                            <Column flex="2">{role.users.length}</Column>
                                            <Column flex="2">{role.permissions.length}</Column>
                                            <Column flex="0 24px"><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                                        </SelectableRow>
                                    )
                                }
                            })
                        }
                    </Table>
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
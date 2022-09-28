import React , { useEffect, useState } from "react";
import styled from "styled-components";

import { Position, Crew } from "@phoenixlan/phoenix.js";

import { PageLoading } from "../../components/pageLoading"

import { Button } from "../../components/button"

import { Theme } from "../../theme";
import { SimpleUserCard } from "../../components/simpleUserCard";

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

    return (<div>
        <h1>Roller</h1>
        {
            loading ? (<PageLoading />) : roles.map((role) => {
                const roleCrew = crews.find((crew) => crew.uuid == role.crew_uuid)
                const roleTeam = roleCrew?.teams.find((team) => team.uuid == role.team_uuid)
                let name = (role.chief ? "Leder av " : "Medlem av ") + (roleTeam ? `${roleTeam.name} i ` : "") + (roleCrew?.name ?? "Ukjent crew");
                if(role.name) {
                    name = `${role.name}${roleCrew ? " (" + name + ")":""}`
                }

                return (<S.Role uuid={role.uuid}>
                    <h2>{name}</h2>
                    <S.UserContainer>
                    {
                        role.users.map(user => (<SimpleUserCard avatarSize={10} user={user}>
                        </SimpleUserCard>))
                    }
                    </S.UserContainer>
                    <i>{role.users.length} bruker{role.users.length > 1 ? "e" : ""}</i>
                </S.Role>)
            })
        }
        <h1>Hva er en rolle?</h1>
        <p>Roller er hvordan brukere tilhører crew, og hvordan brukere har tilgang på nettsiden. Å ha en rolle trenger ikke å bety at du tilhører et crew.</p>
        </div>)
}
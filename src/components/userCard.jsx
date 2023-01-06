import React, { useEffect, useState } from 'react';
import styled from "styled-components";

import { BASE_URL } from "../"

import { Avatar } from "./avatar";
import { getCurrentEvent, getEvent, Crew } from "@phoenixlan/phoenix.js";

import { dateOfBirthToAge, position_mapping_to_string } from '../utils/user';

import { PageLoading } from './pageLoading';
import { Link } from 'react-router-dom';

const S = {
    Container: styled.div`
        display: flex;
    `,
    AvatarPart: styled.div`
        width: 40%;
    `,
    TextPart: styled.div`
        width: 60%;
    `
}


export const UserCard = ({ user }) => {
    const [ currentEvent, setCurrentEvent ] = useState(null);
    const [ positionMappings, setPositionMappings ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    useEffect(async () => {
        const [ positionMappings, currentEvent] = await Promise.all([
            Promise.all(user.position_mappings.map(async (position_mapping) => {
                position_mapping.event = position_mapping.event_uuid ? await getEvent(position_mapping.event_uuid) : null;
                const position = position_mapping.position;
                if(position.crew_uuid) {
                    position.crew = await Crew.getCrew(position.crew_uuid);
                    if(position.team_uuid) {
                        position.team = position.crew.teams.find((team) => team.uuid == position.team_uuid)
                    }
                }
                return position_mapping
            })),
            await getCurrentEvent()
        ])
        setCurrentEvent(currentEvent)
        setPositionMappings(positionMappings)
        setLoading(false);
    }, []);

    if(loading) {
        return (<PageLoading />)
    } else {
        const age = dateOfBirthToAge(user.birthdate);
        return (
            <S.Container>
                <S.AvatarPart>
                    <Avatar user={user}>
                    </Avatar>
                </S.AvatarPart>
                <S.TextPart>
                    <h1>{user.firstname} {user.lastname}</h1>
                    <p>Født: {user.birthdate} ({age} år) { currentEvent !== null ?  
                        (currentEvent.age_limit_inclusive !== -1 && currentEvent.age_limit_inclusive < age) 
                        ? (<b>For gammel!</b>) 
                        : null
                    : (<i>...</i>) }</p>
                    <p>Kjønn: {user.gender === "Gender.male" ? "Mann" : "Kvinne"}</p>
                    <p>Dato registrert: {new Date(user.created*1000).toLocaleString()}</p>
                    <p>Telefonnummer: {user.phone}</p>
                    <p>E-post addresse: {user.email}</p>
                    <h2>Nåværende stillinger</h2>
                    <ul>
                    {
                        positionMappings
                            .filter(mapping => !mapping.event_uuid || mapping.event_uuid === currentEvent.uuid)
                            .map(mapping => (<li>{position_mapping_to_string(mapping)} {!mapping.event ? (<>(<b>Permanent</b>)</>) : null}</li>))
                    }
                    </ul>
                    <h2>Tidligere stillinger</h2>
                    <ul>
                    {
                        positionMappings
                            .filter(mapping => mapping.event_uuid && mapping.event_uuid !== currentEvent.uuid)
                            .map(mapping => (<li>{position_mapping_to_string(mapping)} {mapping.event ? mapping.event.name : (<b>Permanent</b>)}</li>))
                    }
                    </ul>
                    <Link to={`/user/${user.uuid}`}>Bruker-side</Link>
                </S.TextPart>
            </S.Container>
        )
    }
}

import React, { useEffect, useState } from 'react';
import styled from "styled-components";

import { BASE_URL } from "../"

import { Avatar } from "./avatar";
import { getCurrentEvent } from "@phoenixlan/phoenix.js";

import { dateOfBirthToAge } from '../utils/user';

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
    useEffect(async () => {
        setCurrentEvent(await getCurrentEvent());
    }, []);

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
            </S.TextPart>
            
        </S.Container>
    )
}

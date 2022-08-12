import React from 'react';
import styled from "styled-components";

import { BASE_URL } from "../"

import { Avatar } from "./avatar";

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
    const age = dateOfBirthToAge(user.birthdate)
    return (<S.Container>
        <S.AvatarPart>
            <Avatar user={user}>
            </Avatar>
        </S.AvatarPart>
        <S.TextPart>
            <h1>{user.firstname} {user.lastname}</h1>
            <p>Født: {user.birthdate} ({age} år)</p>
            <p>Kjønn: {user.gender === "Gender.male" ? "Mann" : "Kvinne"}</p>
            <p>Dato registrert: {user.created}</p>
            <p>Telefonnummer: {user.phone}</p>
        </S.TextPart>
        
    </S.Container>)
}

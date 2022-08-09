import React from 'react';
import styled from "styled-components";

import { BASE_URL } from "../"

import { Avatar } from "./avatar";

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

const calculateAge = (birthMonth, birthDay, birthYear) => {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth();
    var currentDay = currentDate.getDate(); 
    var calculatedAge = currentYear - birthYear;

    if (currentMonth < birthMonth - 1) {
        calculatedAge--;
    }
    if (birthMonth - 1 == currentMonth && currentDay < birthDay) {
        calculatedAge--;
    }
    return calculatedAge;
}

export const UserCard = ({ user }) => {
    const birthdateComponents = user.birthdate.split("-")
    return (<S.Container>
        <S.AvatarPart>
            <Avatar user={user}>
            </Avatar>
        </S.AvatarPart>
        <S.TextPart>
            <h1>{user.firstname} {user.lastname}</h1>
            <p>Født: {user.birthdate} ({calculateAge(birthdateComponents[1], birthdateComponents[2], birthdateComponents[0])} år)</p>
            <p>Kjønn: {user.gender === "Gender.male" ? "Mann" : "Kvinne"}</p>
            <p>Dato registrert: {user.created}</p>
            <p>Telefonnummer: {user.phone}</p>
        </S.TextPart>
        
    </S.Container>)
}

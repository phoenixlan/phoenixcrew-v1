import React from 'react';
import styled from "styled-components";

import { BASE_URL } from "../"

import default_gutt from "../assets/default_gutt.png"
import default_jente from "../assets/default_jente.png"

const S = {
    Avatar: styled.img`
        width: 100%;
    `
}

export const Avatar = ({ user }) => {
    const avatarUrl = user.avatar ? BASE_URL + user.avatar.urls.sd : (
        user.gender === "Gender.male" ? default_gutt : default_jente
    );
    return (<S.Avatar src={avatarUrl}>
    </S.Avatar>)
}

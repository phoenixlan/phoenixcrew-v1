import React from 'react';
import styled from "styled-components";

import { BASE_URL } from "../"

const S = {
    Avatar: styled.img`
        width: 100%;
    `
}

export const Avatar = ({ user }) => {
    const avatarUrl = user.avatar_urls.sd;

    return (<S.Avatar src={avatarUrl}>
    </S.Avatar>)
}

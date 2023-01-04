import React from 'react';
import styled from "styled-components";

import { BASE_URL } from "../"

const S = {
    Avatar: styled.img`
        width: calc(44px - 16px);
        height: calc(44px - 16px);
        padding: 8px;
    `
}

export const SidebarAvatar = ({ user }) => {
    const avatarUrl = user.avatar_urls.sd;

    return (
        <S.Avatar src={avatarUrl}>
        </S.Avatar>
    )
}

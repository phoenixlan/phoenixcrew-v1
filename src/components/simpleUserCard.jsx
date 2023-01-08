import React from "react";
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const S = {
    UserCard: styled.div`
        display: flex;
        padding: 8px;
        border: 1px solid rgb(235, 235, 235);
        flex: 1 1 28%;
        height: 118px;
        gap: 28px;
        max-width: 292px;

        @media screen and (max-width: 480px) {
            max-width: unset;
        }
    `,
    Avatar: styled.div`
        cursor: pointer;
        background: ${props => props.src ? "url(" + props.src + ")" : "#FFF"};
        background-size: cover;
        background-position: center;
        border-radius: 100%;
        border: 1px solid rgb(235, 235, 235);
        height: 92px;
        width: 92px;
        margin: auto 0;
    `
}

export const SimpleUserCard = ({ user, children, avatarSize }) => {
    const history = useHistory();

    return (
        <S.UserCard key={user.uuid}>
            <S.Avatar size={avatarSize} src={user.avatar_urls.sd} onClick={() => history.push(`/user/${user.uuid}`)}/>
            <p><b>{user.firstname} {user.lastname}</b></p>
            {
                children
            }
        </S.UserCard>
    )
}
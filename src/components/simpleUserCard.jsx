import React from "react";
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const S = {
    UserCard: styled.div`
        display: flex;
        border: 1px solid rgb(235, 235, 235);
        flex: 1 1 28%;
        max-width: 292px;

        @media screen and (max-width: 480px) {
            max-width: unset;
        }
    `,
    AvatarContainer: styled.div`
        cursor: pointer;
        padding: 1em;
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
    `,
    DescriptionContainer: styled.div`
        display: flex;
        flex-flow: column;
        padding: 1em;
        gap: .35rem;
    `,
    UserName: styled.span`
        font-weight: 700;
    `,
    UserTitle: styled.span`
    
    `,
}

export const SimpleUserCard = ({ user, children, avatarSize, groupleader }) => {
    const history = useHistory();

    return (
        <S.UserCard key={user.uuid}>
            <S.AvatarContainer>
                <S.Avatar size={avatarSize} src={user.avatar_urls.sd} onClick={() => history.push(`/user/${user.uuid}`)}/>
            </S.AvatarContainer>
            <S.DescriptionContainer>
                <S.UserName>{user.firstname} {user.lastname}</S.UserName>
                <S.UserTitle>{groupleader ? "Gruppeleder" : "Crew medlem"}</S.UserTitle>
            </S.DescriptionContainer>
            {
                children
            }
        </S.UserCard>
    )
}
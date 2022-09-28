import React from "react";
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const S = {
    UserCard: styled.div`
    margin: 1em;
    border: 1px solid gray;
    border-radius: 0.25em;
    box-shadow: 0.1em 0.1em 0.5em gray;
    `,
    Avatar: styled.img`
    cursor: pointer;
    width: ${(props) => props.size??15}em;
    :hover {
        filter: saturate(50%);
    }
    `
}

export const SimpleUserCard = ({ user, children, avatarSize }) => {
    const history = useHistory();

    return (<S.UserCard key={user.uuid}>
                <S.Avatar size={avatarSize} src={user.avatar_urls.sd} onClick={() => history.push(`/user/${user.uuid}`)}/>
                <p><b>{user.firstname} {user.lastname}</b></p>
                {
                    children
                }
            </S.UserCard>)
}
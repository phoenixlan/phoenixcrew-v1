import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { FormInput } from './form';

import { User } from "@phoenixlan/phoenix.js"

const S = {
    Container: styled.span`
        position: relative;
    `,
    UserList: styled.div`
        position: absolute;
        bottom: 20px;

        width: 100%;

        border: 1px solid black;
        border-radius: 0.3em;
        background-color: white;
    `,
    User: styled.div`
        cursor: pointer;
        :hover {
            background-color: rgba(0, 0, 0, 0.2);
        }
    `,
    UserName: styled.p`
    margin: 0.5em;
    overflow: none;
    `,
    UserEmail: styled.p`
    margin: 0.5em;
    font-size: 0.8em;
    text-decoration: italic;
    `
}

export const UserSearch = ({ onUserSelected }) => {
    const [ query, setQuery ] = useState("");
    const [ users, setUsers ] = useState([]);
    const [ showSuggestions, setShowSuggestions ] = useState(false);

    useEffect(async () => {
        if(query.length >= 3) {
            setUsers(await User.searchUsers(query));
        }
    }, [query]);

    const setUser = (user) => {
        console.log("Click")
        setQuery(`${user.firstname} ${user.lastname}`);
        onUserSelected(user.uuid);
    }

    return (<S.Container>
        {
        (users.length > 0 && showSuggestions) ? (
            <S.UserList>
                {
                    users.map(user => (
                        <S.User key={user.uuid} onMouseDown={() => setUser(user)}>
                            <S.UserName>{user.firstname} {user.lastname}</S.UserName>
                            <S.UserEmail>{user.email}</S.UserEmail>
                        </S.User>
                    ))
                }
            </S.UserList>
        ) : null
        }
        <FormInput value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setShowSuggestions(true)} onBlur={() => setShowSuggestions(false)}/>
    </S.Container>);
}
import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { User } from "@phoenixlan/phoenix.js"
import { InputContainer, InputElement, InputLabel } from "./dashboard";

const S = {
    Container: styled.span`
        position: relative;
    `,
    UserList: styled.div`
        display: flex;
        flex-flow: column-reverse;
        position: absolute;
        top: 40px;

        width: 100%;

        border: 1px solid rgb(135, 135, 135);
        background-color: white;
        z-index: 1000;
    `,
    User: styled.div`
        padding: 6px 8px;
        cursor: pointer;
        :hover {
            background-color: rgb(235, 235, 235);
        }
    `,
    UserName: styled.p`
        margin: 0;
        overflow: none;
    `,
    UserEmail: styled.p`
        margin: 0;
        font-size: 0.8em;
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

    return (
        <S.Container>
            {
                (users.length > 0 && showSuggestions) ? 
                    (
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
                    ) 
                : 
                    null
            }
            
            <InputContainer column extramargin>
                <InputLabel small>Bruker</InputLabel>
                <InputElement value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setShowSuggestions(true)} onBlur={() => setShowSuggestions(false)} />
            </InputContainer>
        </S.Container>
    );
}
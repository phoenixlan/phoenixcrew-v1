import React , { useEffect, useState } from "react";
import styled from "styled-components";

import { User } from "@phoenixlan/phoenix.js";

const S = {
    User: styled.div`
    
    `
}

export const UserList= () => {
    const [users, setUsers] = useState([]);

    useEffect(async () => {
        const users= await User.getUsers();
        setUsers(users);
    }, []);

    return (<div>
        <h1>Brukere</h1>
        {
            users.map((user) => {
                return (<S.User>
                    <h2>{user.firstname} {user.lastname}</h2>
                    <p>{user.uuid} {user.username}</p>
                </S.User>)
            })
        }
        </div>)
}
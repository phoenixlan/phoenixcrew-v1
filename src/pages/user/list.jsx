import React , { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import styled from "styled-components";

import { User } from "@phoenixlan/phoenix.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight }  from '@fortawesome/free-solid-svg-icons'
import { PageLoading } from "../../components/pageLoading"

import { Table, SelectableRow, Column, TableHeader } from "../../components/table";

import { dateOfBirthToAge } from '../../utils/user';

const S = {
    User: styled.div`
    
    `
}

export const UserList= () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    let history = useHistory();

    useEffect(async () => {
        setLoading(true);
        const users= await User.getUsers();
        setUsers(users);
        setLoading(false);
    }, []);

    if(loading) {
        return (<PageLoading />)
    }

    return (<div>
        <h1>Brukere</h1>
        <Table>
            <thead>
                <TableHeader>
                    <Column>Navn</Column>
                    <Column>Alder</Column>
                    <Column>Brukernavn</Column>
                    <Column>Registrert</Column>
                    <Column>UUID</Column>
                </TableHeader>
            </thead>
            {
                users.map((user) => {
                    return (<SelectableRow onClick={e => {history.push(`/user/${user.uuid}`)}}>
                        <Column>{ user.firstname + " " + user.lastname }</Column>
                        <Column>{dateOfBirthToAge(user.birthdate)}</Column>
                        <Column>{ user.username }</Column>
                        <Column>{ new Date(user.created*1000).toLocaleString() }</Column>
                        <Column>{ user.uuid }</Column>
                        <Column>Se mer<FontAwesomeIcon icon={faChevronRight}/></Column>
                    </SelectableRow>)
                })
            }
        </Table>
        </div>)
}
import React , { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import styled from "styled-components";

import { User } from "@phoenixlan/phoenix.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faChevronRight }  from '@fortawesome/free-solid-svg-icons'
import { PageLoading } from "../../components/pageLoading"

import { Table, SelectableRow, Column, TableHeader, IconContainer } from "../../components/table";

import { dateOfBirthToAge } from '../../utils/user';

import { DashboardHeader, DashboardContent, DashboardTitle, DashboardSubtitle, InnerContainer, InnerContainerMini, InputCheckbox } from "../../components/dashboard";
import { Checkbox } from "../../components/inputCheckbox";

const S = {
    User: styled.div`
    
    `
}

export const UserList= () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [visibleUUID, setVisibleUUID] = useState(false);

    let history = useHistory();

    useEffect(async () => {
        setLoading(true);
        const users = await User.getUsers();
        setUsers(users);
        setLoading(false);
    }, []);

    if(loading) {
        return (<PageLoading />)
    }

    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Brukeradministrasjon
                </DashboardTitle>
                <DashboardSubtitle>
                    {users.length} brukere registrert
                </DashboardSubtitle>
            </DashboardHeader>
            <DashboardContent>
                <InnerContainer>
                    <InputCheckbox label="Vis bruker UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                </InnerContainer>

                <InnerContainer>
                    <Table>
                        <TableHeader border>
                            <Column flex="5" visible={!visibleUUID}>UUID</Column>
                            <Column flex="3">Navn</Column>
                            <Column flex="1">Alder</Column>
                            <Column flex="2">Brukernavn</Column>
                            <Column flex="3">Registrert</Column>
                            <Column flex="0 24px" />
                        </TableHeader>
                        {
                            users.map((user) => {
                                return (
                                    <SelectableRow onClick={e => {history.push(`/user/${user.uuid}`)}} title="Trykk for å åpne">
                                        <Column consolas flex="5" visible={!visibleUUID}>{ user.uuid }</Column>
                                        <Column flex="3">{ user.lastname + ", " + user.firstname }</Column>
                                        <Column flex="1">{dateOfBirthToAge(user.birthdate)}</Column>
                                        <Column flex="2">{ user.username }</Column>
                                        <Column flex="3">{ new Date(user.created*1000).toLocaleString('default', {dateStyle: 'short', timeStyle: 'medium'}) }</Column>
                                        <Column flex="0 24px"><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                                    </SelectableRow>
                                )
                            })
                        }
                    </Table>
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
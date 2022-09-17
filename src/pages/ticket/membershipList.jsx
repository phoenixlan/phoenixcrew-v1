
import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom';

import { getEventNewMembers, getCurrentEvent, User } from "@phoenixlan/phoenix.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight }  from '@fortawesome/free-solid-svg-icons'

import { dateOfBirthToAge } from "../../utils/user";

import { Table, SelectableRow, Row, Column } from "../../components/table";

import Spinner from "react-svg-spinner";

export const MembershipList = () => {
    const [ users, setUsers] = useState([]);
    const [ loading, setLoading ] = useState(true);
    let history = useHistory();

    useEffect(async () => {
        const event = await getCurrentEvent();
        const users = await getEventNewMembers(event.uuid);
        setUsers(users)
        setLoading(false)
    }, []);

    return (<>
        <h1>Nye medlemskap(Dette eventet)</h1>
        {
            loading ? (<Spinner />) : (
                <Table>
                    <thead>
                        <Row>
                            <Column>Navn</Column>
                            <Column>Fødselsdato</Column>
                            <Column>Alder</Column>
                            <Column>Telefonnummer</Column>
                            <Column>Addresse</Column>
                            <Column>Postnummer</Column>
                            <Column>UUID</Column>
                        </Row>
                    </thead>
                    <tbody>
                        {
                            users.map((user) => (
                                <SelectableRow onClick={e => {history.push(`/user/${user.uuid}`)}}>
                                    <Column>{user.firstname} {user.lastname}</Column>
                                    <Column>{user.birthdate}</Column>
                                    <Column>{dateOfBirthToAge(user.birthdate)}</Column>
                                    <Column>{user.phone}</Column>
                                    <Column>{user.address}</Column>
                                    <Column>{user.postal_code}</Column>
                                    <Column>{user.uuid}</Column>
                                    <Column>Se mer<FontAwesomeIcon icon={faChevronRight}/></Column>
                                </SelectableRow>
                            ))
                        }
                    </tbody>
                </Table>
            )
        }
        <p>{ users.length } nye medlemmer</p>
    </>)
}
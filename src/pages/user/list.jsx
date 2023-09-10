import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { User } from "@phoenixlan/phoenix.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight }  from '@fortawesome/free-solid-svg-icons'
import { PageLoading } from "../../components/pageLoading"
import { Table, SelectableTableRow, TableCell, TableHead, IconContainer, TableBody, TableRow } from "../../components/table";
import { dateOfBirthToAge } from '../../utils/user';
import { DashboardHeader, DashboardContent, DashboardTitle, DashboardSubtitle, InnerContainer, InputCheckbox, InputContainer, InputElement, InputLabel } from "../../components/dashboard";

const SORTING = {
    FIRSTNAME: 1,
    USERNAME: 2,
    AGE: 3,
    REGISTERDATE: 4
}

export const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sortingMethodActive, setSortingMethodActive] = useState(1);

    const [visibleUUID, setVisibleUUID] = useState(false);

    let history = useHistory();

    useEffect(async () => {
        setLoading(true);
        const users = await User.getUsers();
        setUsers(users);
        setLoading(false);
    }, []);

    const sortedData = (data, sortingMethod) => {
        switch (sortingMethod) {
            case SORTING.FIRSTNAME:
                return [...data].sort((a, b) => a.firstname.localeCompare(b.firstname));
            case SORTING.USERNAME:
                return [...data].sort((a, b) => a.username.localeCompare(b.username));
            case SORTING.AGE:
                return [...data].sort((a, b) => dateOfBirthToAge(a.birthdate) - dateOfBirthToAge(b.birthdate));
            case SORTING.REGISTERDATE:
                return [...data].sort((a, b) => a.created - b.created);
            default:
                return [...data].sort((a, b) => a.firstname.localeCompare(b.firstname));
        }
    }

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
                <InnerContainer mobileHide>
                    Innstillinger:
                    <InputCheckbox label="Vis bruker UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                </InnerContainer>
                <InnerContainer mobileRowGap="4px">
                    Sorter brukere etter:
                    <InputContainer>
                        <InputElement name="1" type="radio" checked={sortingMethodActive === SORTING.FIRSTNAME} onClick={() => setSortingMethodActive(SORTING.FIRSTNAME)} />
                        <InputLabel top="1px">Fornavn, etternavn</InputLabel>
                    </InputContainer>
                    <InputContainer>
                        <InputElement name="1" type="radio" checked={sortingMethodActive === SORTING.USERNAME} onClick={() => setSortingMethodActive(SORTING.USERNAME)} />
                        <InputLabel top="1px">Brukernavn</InputLabel>
                    </InputContainer>
                    <InputContainer>
                        <InputElement name="1" type="radio" checked={sortingMethodActive === SORTING.AGE} onClick={() => setSortingMethodActive(SORTING.AGE)} />
                        <InputLabel top="1px">Alder</InputLabel>
                    </InputContainer>
                    <InputContainer>
                        <InputElement name="1" type="radio" checked={sortingMethodActive === SORTING.REGISTERDATE} onClick={() => setSortingMethodActive(SORTING.REGISTERDATE)} />
                        <InputLabel top="1px">Registreringstid</InputLabel>
                    </InputContainer>
                </InnerContainer>

                <InnerContainer>
                    <Table>
                        <TableHead border>
                            <TableRow>
                                <TableCell as="th" flex="5" visible={!visibleUUID}>UUID</TableCell>
                                <TableCell as="th" flex="3" mobileFlex="3">Navn</TableCell>
                                <TableCell as="th" flex="1" mobileFlex="1">Alder</TableCell>
                                <TableCell as="th" flex="2" mobileHide>Brukernavn</TableCell>
                                <TableCell as="th" flex="3" mobileHide>Registrert</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                sortedData(users, sortingMethodActive).map((user) => {
                                    return (
                                        <SelectableTableRow onClick={e => {history.push(`/user/${user.uuid}`)}} title="Trykk for å åpne" key={user.uuid}>
                                            <TableCell consolas flex="5" visible={!visibleUUID} mobileHide>{ user.uuid }</TableCell>
                                            <TableCell flex="3" mobileFlex="3">{ user.firstname + ", " + user.lastname }</TableCell>
                                            <TableCell flex="1" mobileFlex="1">{dateOfBirthToAge(user.birthdate)}</TableCell>
                                            <TableCell flex="2" mobileHide>{ user.username }</TableCell>
                                            <TableCell flex="3" mobileHide>{ new Date(user.created*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: '2-digit', month: '2-digit', day: '2-digit'}) }</TableCell>
                                        </SelectableTableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
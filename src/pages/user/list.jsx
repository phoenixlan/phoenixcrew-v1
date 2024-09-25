import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { User } from "@phoenixlan/phoenix.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight }  from '@fortawesome/free-solid-svg-icons'
import { PageLoading } from "../../components/pageLoading"
import { Table, SelectableTableRow, TableCell, TableHead, IconContainer, TableBody, TableRow } from "../../components/table";
import { dateOfBirthToAge } from '../../utils/user';
import { DashboardHeader, DashboardContent, DashboardTitle, DashboardSubtitle, InnerContainer, InputCheckbox, InputLabel, InputContainer, InputElement, InnerContainerRow, InputSelect } from "../../components/dashboard";


const SORTING_METHODS = {
    FIRSTNAME: 1,
    USERNAME: 2,
    AGE: 3,
    CREATED: 4
}

const SORTING_TYPES = {}
SORTING_TYPES[SORTING_METHODS.FIRSTNAME] = (a, b) => a.firstname.localeCompare(b.firstname);
SORTING_TYPES[SORTING_METHODS.USERNAME] = (a, b) => a.username.localeCompare(b.username);
SORTING_TYPES[SORTING_METHODS.CREATED] = (a, b) => a.created - b.created;
SORTING_TYPES[SORTING_METHODS.AGE] = (a, b) => dateOfBirthToAge(a.birthdate) - dateOfBirthToAge(b.birthdate);

export const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSortingMethod, setActiveSortingMethod] = useState(1);
    const [search, setSearch] = useState("");

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

    let processedUserList = users
        .filter((user) => 
            user.uuid.toLowerCase().includes(search) ||
            user.firstname.toLowerCase().includes(search) || 
            user.lastname.toLowerCase().includes(search) ||
            user.username.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search) ||
            user.phone.includes(search)
        )
        .sort(SORTING_TYPES[activeSortingMethod])

    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Brukeradministrasjon
                </DashboardTitle>
                <DashboardSubtitle>
                    { search 
                      ? "Viser " + processedUserList.length + " av " + users.length + " brukere registrert"
                      : users.length + " brukere registrert"
                    }
                </DashboardSubtitle>
            </DashboardHeader>
            <DashboardContent>
                

                <InnerContainerRow>
                    <InnerContainer flex="1">
                        <InputContainer column extramargin>
                            <InputLabel small>Søk</InputLabel>
                            <InputElement type="text" placeholder="Fornavn, etternavn ..." onChange={(e) => setSearch(e.target.value.toLowerCase())}></InputElement>
                        </InputContainer>
                        <InputContainer column extramargin>
                            <InputLabel small>Sortering</InputLabel>
                            <InputSelect onChange={(e) => setActiveSortingMethod(e.target.value)}>
                                <option value={SORTING_METHODS.FIRSTNAME}>Fornavn</option>
                                <option value={SORTING_METHODS.USERNAME}>Brukernavn</option>
                                <option value={SORTING_METHODS.AGE}>Alder</option>
                                <option value={SORTING_METHODS.CREATED}>Registrert</option>
                            </InputSelect>
                        </InputContainer>
                        <InnerContainer mobileHide>
                            <InputLabel small>Innstillinger</InputLabel>
                            <InputCheckbox label="Vis bruker UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                        </InnerContainer>
                    </InnerContainer>
                    <InnerContainer flex="1" /> 
                    <InnerContainer flex="1" /> 
                </InnerContainerRow>

                <InnerContainer>
                    <Table>
                        <TableHead border>
                            <TableRow>
                                <TableCell as="th" flex="5" visible={!visibleUUID}>UUID</TableCell>
                                <TableCell as="th" flex="3" mobileFlex="3">Navn</TableCell>
                                <TableCell as="th" flex="1" mobileFlex="1">Alder</TableCell>
                                <TableCell as="th" flex="2" mobileHide>Brukernavn</TableCell>
                                <TableCell as="th" flex="3" mobileHide>Registrert</TableCell>
                                <TableCell as="th" flex="0 24px" mobileHide/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                processedUserList.map((user) => {
                                    return (
                                        <SelectableTableRow onClick={e => {history.push(`/user/${user.uuid}`)}} title="Trykk for å åpne" key={user.uuid}>
                                            <TableCell consolas flex="5" visible={!visibleUUID} mobileHide>{ user.uuid }</TableCell>
                                            <TableCell flex="3" mobileFlex="3">{ user.firstname + " " + user.lastname }</TableCell>
                                            <TableCell flex="1" mobileFlex="1">{dateOfBirthToAge(user.birthdate)}</TableCell>
                                            <TableCell flex="2" mobileHide>{ user.username }</TableCell>
                                            <TableCell flex="3" mobileHide>{ new Date(user.created*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: '2-digit', month: '2-digit', day: '2-digit'}) }</TableCell>
                                            <TableCell flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
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
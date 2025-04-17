import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { User } from "@phoenixlan/phoenix.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight }  from '@fortawesome/free-solid-svg-icons'
import { PageLoading } from "../../components/pageLoading"
import { Table, SelectableTableRow, TableCell, TableHead, IconContainer, TableBody, TableRow } from "../../components/table";
import { dateOfBirthToAge } from '../../utils/user';
import { DashboardHeader, DashboardContent, DashboardTitle, DashboardSubtitle, InnerContainer, InputCheckbox, SpanLink } from "../../components/dashboard";

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
                    <Table>
                        <TableHead border>
                            <TableRow>
                                <TableCell as="th" flex="5" visible={!visibleUUID}>UUID <SpanLink onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? "(Skjul UUID)" : null}</SpanLink></TableCell>
                                <TableCell as="th" flex="3" mobileFlex="3">Navn <SpanLink mobileHide onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? null : "(Vis UUID)"}</SpanLink></TableCell>
                                <TableCell as="th" flex="1" mobileFlex="1">Alder</TableCell>
                                <TableCell as="th" flex="2" mobileHide>Brukernavn</TableCell>
                                <TableCell as="th" flex="3" mobileHide>Registrert</TableCell>
                                <TableCell as="th" flex="0 24px" mobileHide/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                users.map((user) => {
                                    return (
                                        <SelectableTableRow onClick={e => {history.push(`/user/${user.uuid}`)}} title="Trykk for å åpne" key={user.uuid}>
                                            <TableCell consolas flex="5" visible={!visibleUUID} mobileHide>{ user.uuid }</TableCell>
                                            <TableCell flex="3" mobileFlex="3">{ user.lastname + ", " + user.firstname }</TableCell>
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
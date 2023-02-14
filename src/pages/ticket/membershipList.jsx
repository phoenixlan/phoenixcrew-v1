
import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom';
import { getEventNewMembers, getCurrentEvent } from "@phoenixlan/phoenix.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight }  from '@fortawesome/free-solid-svg-icons'
import { dateOfBirthToAge } from "../../utils/user";
import { Table, SelectableTableRow, Row, TableCell, TableHead, IconContainer, TableRow, TableBody } from "../../components/table";
import { PageLoading } from "../../components/pageLoading";
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InputCheckbox } from "../../components/dashboard";

export const MembershipList = () => {
    const [ users, setUsers] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [visibleUUID, setVisibleUUID] = useState(false);
    
    let history = useHistory();

    useEffect(async () => {
        const event = await getCurrentEvent();
        const users = await getEventNewMembers(event.uuid);
        setUsers(users)
        setLoading(false)
    }, []);

    if(loading) {
        return (
            <PageLoading />
        )
    }
    else {
        return (
            <>
                <DashboardHeader border>
                    <DashboardTitle>
                        Nye medlemsskap
                    </DashboardTitle>
                    <DashboardSubtitle>
                        {users.length} nye medlemsskap fra dette arrangementet
                    </DashboardSubtitle>
                </DashboardHeader>
                <DashboardContent>
                    <InnerContainer mobileHide>
                        <InputCheckbox label="Vis bruker UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                    </InnerContainer>
                    <InnerContainer>
                        <Table>
                            <TableHead border>
                                <TableRow>
                                    <TableCell flex="10" mobileHide visible={!visibleUUID}>UUID</TableCell>
                                    <TableCell flex="6" mobileFlex="3">Navn</TableCell>
                                    <TableCell flex="2" mobileFlex="1">Alder</TableCell>
                                    <TableCell flex="4" mobileHide>Fødselsdato</TableCell>
                                    <TableCell flex="4" mobileHide>Telefonnummer</TableCell>
                                    <TableCell flex="5" mobileHide>Addresse</TableCell>
                                    <TableCell flex="2" mobileHide>Postnr.</TableCell>
                                    <TableCell center flex="0 24px" mobileHide title="Trykk for å åpne"><IconContainer>...</IconContainer></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    users.map((user) => (
                                        <SelectableTableRow onClick={e => {history.push(`/user/${user.uuid}`)}}>
                                            <TableCell flex="10" mobileHide consolas visible={!visibleUUID}>{user.uuid}</TableCell>
                                            <TableCell flex="6" mobileFlex="3">{user.firstname} {user.lastname}</TableCell>
                                            <TableCell flex="2" mobileFlex="1">{dateOfBirthToAge(user.birthdate)}</TableCell>
                                            <TableCell flex="4" mobileHide>{ new Date(user.birthdate).toLocaleString('no-NO', {year: 'numeric', month: '2-digit', day: '2-digit'}) }</TableCell>
                                            <TableCell flex="4" mobileHide>{user.phone}</TableCell>
                                            <TableCell flex="5" mobileHide>{user.address}</TableCell>
                                            <TableCell flex="2" mobileHide>{user.postal_code}</TableCell>
                                            <TableCell center flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
                                        </SelectableTableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}

import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom';
import { getEventNewMembers, getCurrentEvent } from "@phoenixlan/phoenix.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight }  from '@fortawesome/free-solid-svg-icons'
import { dateOfBirthToAge } from "../../utils/user";
import { Table, SelectableRow, Row, Column, TableHeader, IconContainer } from "../../components/table";
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
                            <TableHeader border>
                                <Column flex="10" mobileHide visible={!visibleUUID}>UUID</Column>
                                <Column flex="6" mobileFlex="3">Navn</Column>
                                <Column flex="2" mobileFlex="1">Alder</Column>
                                <Column flex="4" mobileHide>Fødselsdato</Column>
                                <Column flex="4" mobileHide>Telefonnummer</Column>
                                <Column flex="5" mobileHide>Addresse</Column>
                                <Column flex="2" mobileHide>Postnr.</Column>
                                <Column center flex="0 24px" mobileHide title="Trykk for å åpne"><IconContainer>...</IconContainer></Column>
                            </TableHeader>
                        
                            {
                                users.map((user) => (
                                    <SelectableRow onClick={e => {history.push(`/user/${user.uuid}`)}}>
                                        <Column flex="10" mobileHide consolas visible={!visibleUUID}>{user.uuid}</Column>
                                        <Column flex="6" mobileFlex="3">{user.firstname} {user.lastname}</Column>
                                        <Column flex="2" mobileFlex="1">{dateOfBirthToAge(user.birthdate)}</Column>
                                        <Column flex="4" mobileHide>{ new Date(user.birthdate).toLocaleString('no-NO', {year: 'numeric', month: '2-digit', day: '2-digit'}) }</Column>
                                        <Column flex="4" mobileHide>{user.phone}</Column>
                                        <Column flex="5" mobileHide>{user.address}</Column>
                                        <Column flex="2" mobileHide>{user.postal_code}</Column>
                                        <Column center flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                                    </SelectableRow>
                                ))
                            }
                        </Table>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
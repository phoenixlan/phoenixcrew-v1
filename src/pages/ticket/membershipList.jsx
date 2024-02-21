
import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom';
import { getEventNewMembers, getCurrentEvent, getEvents } from "@phoenixlan/phoenix.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight }  from '@fortawesome/free-solid-svg-icons'
import { dateOfBirthToAge } from "../../utils/user";
import { Table, SelectableTableRow, Row, TableCell, TableHead, IconContainer, TableRow, TableBody } from "../../components/table";
import { PageLoading } from "../../components/pageLoading";
import { InnerContainerRow, InputContainer, InputLabel, InputSelect, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InputCheckbox } from "../../components/dashboard";
import { FormButton } from '../../components/form';

export const MembershipList = () => {
    const [ users, setUsers] = useState([]);
    const [ currentEvent, setCurrentEvent ] = useState();
    const [ events, setEvents ] = useState();
    const [ loading, setLoading ] = useState(true);
    const [ visibleUUID, setVisibleUUID ] = useState(false);
    
    let history = useHistory();

    const [ currentViewingEvent, setCurrentViewingEvent ] = useState(null);

    const updateViewingEvent = (event) => {
        console.log("Viewing event update")
        setCurrentViewingEvent(event.target.value)
    }

    const load = async () => {
        setLoading(true);
        const [ currentEvent, events ] = await Promise.all([
            getCurrentEvent(),
            getEvents()
        ])
        setCurrentEvent(currentEvent)
        const lookupEvent = (currentViewingEvent) ?? currentEvent.uuid;
        console.log("Lookup event: " + lookupEvent + `(${currentViewingEvent})`)

        const users = await getEventNewMembers(lookupEvent);
        setUsers(users)
        if(!currentViewingEvent) {
            setCurrentViewingEvent(currentEvent.uuid);
        }
        setEvents(events)
        setLoading(false)
    }

    const downloadTextFile = (filename, text) => {
        console.log(text);

        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }


    const makeCsvFromUsers = (csvUsers) => {
        const csv = csvUsers.map(user => {
            const birthdate = new Date(user.birthdate).toLocaleString('no-NO', {year: 'numeric', month: '2-digit', day: '2-digit'})
            return `${user.firstname} ${user.lastname},${dateOfBirthToAge(user.birthdate)},${birthdate},${user.address},${user.postal_code}`
        }).join("\n")
        const header = "Navn,Alder,Fødselsdag,Addresse,Postnummer\n"
        downloadTextFile(`lan-medlemmer-${currentEvent.name.replace(" ", "-")}.csv`, header+csv)
    }

    const makeCsv = () => {
        makeCsvFromUsers(users)
    }

    useEffect(async () => {
        await load();
    }, [currentViewingEvent]);

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
                    <InnerContainer extramargin border>
                        <InnerContainerRow nopadding>
                            <InnerContainer flex="1">
                                <InnerContainerRow nopadding nowrap>
                                    <InputContainer column mobileNoMargin>
                                        <InputLabel small>Arrangement</InputLabel>
                                        <InputSelect value={currentViewingEvent} onChange={updateViewingEvent}>
                                            {
                                                events.map((event) => (<option value={event.uuid}>{event.name} {event.uuid == currentEvent.uuid ? "(Nåværende)" : null}</option>))
                                            }
                                        </InputSelect>
                                    </InputContainer>
                                </InnerContainerRow>
                            </InnerContainer>
                            <InnerContainer flex="1" >
                                <FormButton type="submit" onClick={() => makeCsv()}>Generer CSV</FormButton>
                            </InnerContainer>
                            <InnerContainer flex="1" mobileHide />
                        </InnerContainerRow>
                    </InnerContainer>
                    <InnerContainer mobileHide>
                        <InputCheckbox label="Vis bruker UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                    </InnerContainer>
                    <InnerContainer>
                        <Table>
                            <TableHead border>
                                <TableRow>
                                    <TableCell as="th" flex="10" mobileHide visible={!visibleUUID}>UUID</TableCell>
                                    <TableCell as="th" flex="6" mobileFlex="3">Navn</TableCell>
                                    <TableCell as="th" flex="2" mobileFlex="1">Alder</TableCell>
                                    <TableCell as="th" flex="4" mobileHide>Fødselsdato</TableCell>
                                    <TableCell as="th" flex="4" mobileHide>Telefonnummer</TableCell>
                                    <TableCell as="th" flex="5" mobileHide>Addresse</TableCell>
                                    <TableCell as="th" flex="2" mobileHide>Postnr.</TableCell>
                                    <TableCell as="th" center flex="0 24px" mobileHide title="Trykk for å åpne"><IconContainer>...</IconContainer></TableCell>
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
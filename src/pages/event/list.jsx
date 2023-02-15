import React , { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { getEvents } from "@phoenixlan/phoenix.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight }  from '@fortawesome/free-solid-svg-icons'
import { PageLoading } from "../../components/pageLoading"
import { Table, SelectableTableRow, TableCell, TableHead, IconContainer, TableRow, TableBody } from "../../components/table";
import { DashboardContent, DashboardHeader, DashboardTitle, InnerContainer, InputCheckbox } from "../../components/dashboard"; 

export const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [visibleUUID, setVisibleUUID] = useState(false);

    let history = useHistory();

    useEffect(async () => {
        setLoading(true);
        const events = await getEvents();
        setEvents(events);
        setLoading(false);
    }, []);

    if(loading) {
        return (<PageLoading />)
    }

    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Arrangementadministrasjon
                </DashboardTitle>
            </DashboardHeader>

            

            <DashboardContent>
                <InnerContainer mobileHide>
                    <InputCheckbox label="Vis arrangement UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                </InnerContainer>

                <InnerContainer>
                    <Table>
                        <TableHead border>
                            <TableRow>
                                <TableCell as="th" flex="14" visible={!visibleUUID} mobileHide>UUID</TableCell>
                                <TableCell as="th" flex="8">Tittel</TableCell>
                                <TableCell as="th" flex="5" mobileHide>Billettsalg</TableCell>
                                <TableCell as="th" flex="5" mobileHide>Start</TableCell>
                                <TableCell as="th" flex="5" mobileHide>Slutt</TableCell>
                                <TableCell as="th" flex="4" mobileHide>Lokasjon</TableCell>
                                <TableCell as="th" flex="4" mobileHide>Seatmap</TableCell>
                                <TableCell as="th" flex="0 24px" mobileHide><IconContainer/></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                events.map((event) => {
                                    return (
                                    <SelectableTableRow onClick={e => {history.push(`/event/${event.uuid}`)}}>
                                        <TableCell consolas flex="14" visible={!visibleUUID} mobileHide>{ event.uuid }</TableCell>
                                        <TableCell flex="8">{ event.name}</TableCell>
                                        <TableCell flex="5" mobileHide>{ new Date(event.booking_time * 1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: '2-digit', month: '2-digit', day: '2-digit'}) }</TableCell>
                                        <TableCell flex="5" mobileHide>{ new Date(event.start_time * 1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: '2-digit', month: '2-digit', day: '2-digit'}) }</TableCell>
                                        <TableCell flex="5" mobileHide>{ new Date(event.end_time * 1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: '2-digit', month: '2-digit', day: '2-digit'}) }</TableCell>
                                        <TableCell flex="4" mobileHide>{ event.location?.name??"Ikke satt" }</TableCell>
                                        <TableCell flex="4" mobileHide>{ event.seatmap?.name??"Ikke satt" }</TableCell>
                                        <TableCell flex="0 24px" mobileHide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
                                    </SelectableTableRow>)
                                })
                            }
                        </TableBody>
                    </Table>
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
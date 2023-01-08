import React , { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { getEvents } from "@phoenixlan/phoenix.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight }  from '@fortawesome/free-solid-svg-icons'
import { PageLoading } from "../../components/pageLoading"
import { Table, SelectableRow, Column, TableHeader, IconContainer } from "../../components/table";
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
                <InnerContainer mqhide>
                    <InputCheckbox label="Vis arrangement UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                </InnerContainer>

                <InnerContainer>
                    <Table>
                        <TableHeader border>
                            <Column flex="14" visible={!visibleUUID} mqhide>UUID</Column>
                            <Column flex="8">Tittel</Column>
                            <Column flex="5" mqhide>Billettsalg</Column>
                            <Column flex="5" mqhide>Start</Column>
                            <Column flex="5" mqhide>Slutt</Column>
                            <Column flex="4" mqhide>Lokasjon</Column>
                            <Column flex="4" mqhide>Seatmap</Column>
                            <Column flex="0 24px" mqhide><IconContainer/></Column>
                        </TableHeader>
                        {
                            events.map((event) => {
                                return (
                                <SelectableRow onClick={e => {history.push(`/event/${event.uuid}`)}}>
                                    <Column consolas flex="14" visible={!visibleUUID} mqhide>{ event.uuid }</Column>
                                    <Column flex="8">{ event.name}</Column>
                                    <Column flex="5" mqhide>{ new Date(event.booking_time * 1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: '2-digit', month: '2-digit', day: '2-digit'}) }</Column>
                                    <Column flex="5" mqhide>{ new Date(event.start_time * 1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: '2-digit', month: '2-digit', day: '2-digit'}) }</Column>
                                    <Column flex="5" mqhide>{ new Date(event.end_time * 1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: '2-digit', month: '2-digit', day: '2-digit'}) }</Column>
                                    <Column flex="4" mqhide>{ event.location?.name??"Ikke satt" }</Column>
                                    <Column flex="4" mqhide>{ event.seatmap?.name??"Ikke satt" }</Column>
                                    <Column flex="0 24px" mqhide><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                                </SelectableRow>)
                            })
                        }
                    </Table>
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
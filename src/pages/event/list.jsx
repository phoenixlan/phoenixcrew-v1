import React , { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import styled from "styled-components";

import { getEvents } from "@phoenixlan/phoenix.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faChevronRight }  from '@fortawesome/free-solid-svg-icons'
import { PageLoading } from "../../components/pageLoading"

import { Table, SelectableRow, Column, TableHeader, IconContainer } from "../../components/table";

import { dateOfBirthToAge } from '../../utils/user';
import { DashboardContent, DashboardHeader, DashboardTitle, InnerContainer, InputCheckbox } from "../../components/dashboard";
import { Checkbox } from "../../components/inputCheckbox";

const S = {
    User: styled.div`
    
    `
}

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
                <InnerContainer>
                    <InputCheckbox label="Vis arrangement UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                </InnerContainer>

                <InnerContainer>
                    <Table>
                        <TableHeader border>
                            <Column flex="12" visible={!visibleUUID}>UUID</Column>
                            <Column flex="4">Tittel</Column>
                            <Column flex="5">Billettsalg</Column>
                            <Column flex="5">Start</Column>
                            <Column flex="5">Slutt</Column>
                            <Column flex="4">Lokasjon</Column>
                            <Column flex="4">Seatmap</Column>
                            <Column flex="0 24px"><IconContainer/></Column>
                        </TableHeader>
                        {
                            events.map((event) => {
                                return (
                                <SelectableRow onClick={e => {history.push(`/event/${event.uuid}`)}}>
                                    <Column consolas flex="12" visible={!visibleUUID}>{ event.uuid }</Column>
                                    <Column flex="4">{ event.name}</Column>
                                    <Column flex="5">{ new Date(event.booking_time * 1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: '2-digit', month: '2-digit', day: '2-digit'}) }</Column>
                                    <Column flex="5">{ new Date(event.start_time * 1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: '2-digit', month: '2-digit', day: '2-digit'}) }</Column>
                                    <Column flex="5">{ new Date(event.end_time * 1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: '2-digit', month: '2-digit', day: '2-digit'}) }</Column>
                                    <Column flex="4">{ event.location?.name??"Ikke satt" }</Column>
                                    <Column flex="4">{ event.seatmap?.name??"Ikke satt" }</Column>
                                    <Column flex="0 24px"><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                                </SelectableRow>)
                            })
                        }
                    </Table>
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
import React , { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import styled from "styled-components";

import { getEvents } from "@phoenixlan/phoenix.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight }  from '@fortawesome/free-solid-svg-icons'
import { PageLoading } from "../../components/pageLoading"

import { Table, SelectableRow, Column, TableHeader } from "../../components/table";

import { dateOfBirthToAge } from '../../utils/user';

const S = {
    User: styled.div`
    
    `
}

export const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
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

    return (<div>
        <h1>Arrangementer</h1>
        <Table>
            <thead>
                <TableHeader>
                    <Column>UUID</Column>
                    <Column>Tittel</Column>
                    <Column>Billettsalg</Column>
                    <Column>Start</Column>
                    <Column>Slutt</Column>
                    <Column>Lokasjon</Column>
                    <Column>Seatmap</Column>
                </TableHeader>
            </thead>
            {
                events.map((event) => {
                    return (<SelectableRow onClick={e => {history.push(`/event/${event.uuid}`)}}>
                        <Column>{ event.uuid }</Column>
                        <Column>{ event.name}</Column>
                        <Column>{ new Date(event.booking_time*1000).toLocaleString() }</Column>
                        <Column>{ new Date(event.start_time*1000).toLocaleString() }</Column>
                        <Column>{ new Date(event.end_time*1000).toLocaleString() }</Column>
                        <Column>{ event.location?.name??"Ikke satt" }</Column>
                        <Column>{ event.seatmap?.name??"Ikke satt" }</Column>
                        <Column>Se mer<FontAwesomeIcon icon={faChevronRight}/></Column>
                    </SelectableRow>)
                })
            }
        </Table>
        </div>)
}
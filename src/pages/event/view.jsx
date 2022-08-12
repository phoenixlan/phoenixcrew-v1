import React , { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import styled from "styled-components";

import { getEvent } from "@phoenixlan/phoenix.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight }  from '@fortawesome/free-solid-svg-icons'
import { PageLoading } from "../../components/pageLoading"

import { Table, SelectableRow, Column, TableHeader } from "../../components/table";

import { dateOfBirthToAge } from '../../utils/user';

const S = {
    User: styled.div`
    
    `
}

export const EventViewer = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { uuid } = useParams();
    let history = useHistory();

    useEffect(async () => {
        setLoading(true);
        const events = await getEvent(uuid);
        setEvents(events);
        setLoading(false);
    }, []);

    if(loading) {
        return (<PageLoading />)
    }

    return (<div>
            <h1>Rediger arrangement</h1>
        </div>
        )
}
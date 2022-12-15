import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

import styled from 'styled-components';

import { User, Agenda, getCurrentEvent, getEvent, getEvents } from '@phoenixlan/phoenix.js'

import { PageLoading } from "../../components/pageLoading"

import { FormContainer, FormEntry, FormLabel, FormInput, FormError } from '../../components/form';
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, IFrameContainer, InnerColumn, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputDate, InputElement, InputLabel, InputText } from '../../components/dashboard';
import { faEye, faEyeSlash, faMinus, faMinusCircle, faSlash, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Column, IconContainer, InnerColumnCenter, SelectableRow, Table, TableHeader } from '../../components/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';


const S = {
    AgendaEntryContainer: styled.div`
        padding: 1em;
        border: 1px solid black;
    `,
    AgendaContainer: styled.div`
        display: flex;
    `
}

const AgendaEntry = ({ entry, reloadAgendaList }) => {
    const deleteEntry = async () => {
        if(!await Agenda.deleteAgendaEntry(entry.uuid)) {
            console.log("uwu fuckie wuckie");
        }
        await reloadAgendaList();
    }

    if (new Date(entry.time*1000) > (Date.now() - 5 * 60000)) {
        return (
            <SelectableRow>
                <Column flex="2">{ new Date(entry.time*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: '2-digit', month: '2-digit', day: '2-digit'}) }</Column>
                <Column flex="3">{ entry.title }</Column>
                <Column flex="4">{ entry.description }</Column>
                <Column flex="0 24px" center><IconContainer><FontAwesomeIcon icon={faEye} title="Elementet er innenfor tidsrommet til hva skjermen skal vise, og vises" /></IconContainer></Column>
                <Column flex="0 24px" center><IconContainer><FontAwesomeIcon icon={faTrash} onClick={deleteEntry} title="Trykk for å slette elementet" /></IconContainer></Column>
            </SelectableRow>
        )
    } else {
        return (
            <SelectableRow>
                <Column flex="2" color="rgb(150, 150, 150)">{ new Date(entry.time*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: '2-digit', month: '2-digit', day: '2-digit'}) }</Column>
                <Column flex="3" color="rgb(150, 150, 150)">{ entry.title }</Column>
                <Column flex="4" color="rgb(150, 150, 150)">{ entry.description }</Column>
                <Column flex="0 24px" center><IconContainer><FontAwesomeIcon icon={faEyeSlash} title="Elementet er utenfor tidsrommet til hva skjermen skal vise, og er skjult" /></IconContainer></Column>
                <Column flex="0 24px" center><IconContainer><FontAwesomeIcon icon={faTrash} onClick={deleteEntry} title="Trykk for å slette elementet" /></IconContainer></Column>
            </SelectableRow>
        )
    }
}


export const AgendaElementView = (props) => {
    
    //const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { uuid } = useParams();
    const [agendaElement, setAgendaElement] = useState([]);
    const [loading, setLoading] = useState(true);

    //const [inputDatetimeValue, setInputDatetimeValue ] = useState(  );

    const getAgenda = async () => {
        try {
            const agendaElement = await Agenda.getAgendaElement(uuid);

            if(agendaElement) {
                console.log("Fetched agenda element:")
                console.log(agendaElement);
    
                setAgendaElement(agendaElement);
                setLoading(false);
            }
        }
        catch(e) {
            console.log(e);
        }
    }

    useEffect(async () => {
        getAgenda();
    }, []);

    /*const onSubmit = async (data) => {
        // Get current event so we can get its UUID
        const event = await getCurrentEvent();
        const dateUnixTime = new Date(data.time);
        if(!await Agenda.createAgendaEntry(data.title, data.description, event.uuid, dateUnixTime.getTime()/1000)) {
            console.log("fucked up")
        }
        await reloadAgendaList();
    }*/

    if(loading) {
        return (<PageLoading />)
    } else {
    //TODO not quite right, backend har ikke application state enda
    return (
        <>
            <DashboardHeader>
                <DashboardTitle>
                    Agenda
                </DashboardTitle>
                <DashboardSubtitle>
                    {agendaElement.uuid}
                </DashboardSubtitle>
            </DashboardHeader>

            <DashboardContent>
                <InnerContainer>
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
};


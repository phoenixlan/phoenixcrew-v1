import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

import styled from 'styled-components';

import { Agenda, getCurrentEvent } from '@phoenixlan/phoenix.js'

import { PageLoading } from "../../components/pageLoading"

import { FormContainer, FormEntry, FormLabel, FormInput, FormError } from '../../components/form';


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
    return (<S.AgendaEntryContainer>
        <h1>{entry.title}</h1>
        <p>{entry.description}</p>
        <p>{new Date(entry.time*1000).toLocaleString()}</p>
        <button onClick={deleteEntry}>Slett</button>
    </S.AgendaEntryContainer>)
}


export const AgendaList = (props) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [agendaList, setAgendaList] = useState([]);
    const [loading, setLoading] = useState(true);

    const reloadAgendaList = async () => {
        setLoading(true);
        const agendaList = await Agenda.getAgenda();
        if(agendaList) {
            console.log("Fetched applicationList:")
            console.log(agendaList);

            setAgendaList(agendaList);
            setLoading(false);
        }
    }

    useEffect(() => {
        reloadAgendaList().catch(e => {
            console.log(e);
        })
    }, []);

    const onSubmit = async (data) => {
        // Get current event so we can get its UUID
        const event = await getCurrentEvent();
        const dateUnixTime = new Date(data.time);
        if(!await Agenda.createAgendaEntry(data.title, data.description, event.uuid, dateUnixTime.getTime()/1000)) {
            console.log("fucked up")
        }
        await reloadAgendaList();
    }

    if(loading) {
        return (<PageLoading />)
    }
    //TODO not quite right, backend har ikke application state enda
    return (<div>
        <h1>Agenda</h1>
        <S.AgendaContainer>
        {
            agendaList.map(entry => {
                return (<AgendaEntry reloadAgendaList={reloadAgendaList} entry={entry} key={entry.uuid}/>)
            })
        }
        </S.AgendaContainer>
        <h1>Ny agenda</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormContainer>
                <FormEntry>
                    <FormLabel>Tittel</FormLabel>
                    <FormInput {...register("title")}></FormInput>
                    {errors.description && <FormError>Beskrivelse er påkrevd</FormError>}
                </FormEntry>
                <FormEntry>
                    <FormLabel>Beskrivelse</FormLabel>
                    <FormInput {...register("description")}></FormInput>
                </FormEntry>
                <FormEntry>
                    <FormLabel>Tidspunkt</FormLabel>
                    <FormInput type="datetime-local" {...register("time")}></FormInput>
                    {errors.time && <FormError>Tidspunkt er påkrevd</FormError>}
                </FormEntry>
                <FormEntry>
                    <FormInput type="submit"></FormInput>
                </FormEntry>
            </FormContainer>
        </form>
    </div>)
};
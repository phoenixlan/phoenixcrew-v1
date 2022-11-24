import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

import styled from 'styled-components';

import { User, Agenda, getCurrentEvent, getEvent, getEvents } from '@phoenixlan/phoenix.js'

import { PageLoading } from "../../components/pageLoading"

import { FormContainer, FormEntry, FormLabel, FormInput, FormError } from '../../components/form';
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardTitle, IFrameContainer, InnerColumn, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputDate, InputElement, InputLabel, InputText } from '../../components/dashboard';
import { faMinus, faMinusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Column, IconContainer, SelectableRow, Table, TableHeader } from '../../components/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


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

    return (
        <SelectableRow>
            <Column flex="2">{ new Date(entry.time*1000).toLocaleString('default', {dateStyle: 'short', timeStyle: 'short'}) }</Column>
            <Column flex="3">{ entry.title }</Column>
            <Column flex="4">{ entry.description }</Column>
            <Column flex="0 22px"><IconContainer><FontAwesomeIcon icon /></IconContainer></Column>
            <Column flex="0 22px"><IconContainer><FontAwesomeIcon icon={faMinusCircle} onClick={deleteEntry} title="Trykk for å slette elementet" /></IconContainer></Column>
        </SelectableRow>
    )
}


export const AgendaList = (props) => {
    const [activeContent, setActiveContent] = useState(1);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [agendaList, setAgendaList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [inputDatetimeValue, setInputDatetimeValue ] = useState(  );

    const reloadAgendaList = async () => {
        const agendaList = await Agenda.getAgenda();
        if(agendaList) {
            console.log("Fetched applicationList:")
            console.log(agendaList);

            setAgendaList(agendaList);
            setLoading(false);
        }
    }

    

    useEffect(async () => {
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
    } else {
    //TODO not quite right, backend har ikke application state enda
    return (
        <>
            <DashboardHeader>
                <DashboardTitle>
                    Agenda
                </DashboardTitle>
            </DashboardHeader>

            <DashboardBarSelector border>
                <DashboardBarElement active={activeContent == 1} onClick={() => setActiveContent(1)}>Oppsett</DashboardBarElement>
                <DashboardBarElement active={activeContent == 2} onClick={() => setActiveContent(2)}>Infoskjerm visning</DashboardBarElement>
            </DashboardBarSelector>

            <DashboardContent visible={activeContent == 1}>
                <InnerContainer>
                    <InnerContainerTitle>
                        Opprett et nytt element
                    </InnerContainerTitle>

                    <InnerContainerRow>
                        <InnerContainer flex="1">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <>
                                <InputContainer column extramargin>
                                    <InputLabel small>Tittel</InputLabel>
                                    <InputElement type="text" {...register("title")} />
                                </InputContainer>
                                
                                <InputContainer column extramargin>
                                    <InputLabel small>Beskrivelse</InputLabel>
                                    <InputElement type="text" {...register("description")} />
                                </InputContainer>
                                <InputContainer column extramargin>
                                    <InputLabel small>Tidspunkt</InputLabel>
                                    <InputElement type="datetime-local" defaultValue={new Date().toISOString().slice(0, -8)} {...register("time")} />
                                </InputContainer>
                                </>
                                <FormInput type="submit"></FormInput>
                                {/** THE FORM DOESNT WORK BECAUSE SOMETHING... */}
                            </form>
                        </InnerContainer>
                        <InnerContainer flex="2" />
                    </InnerContainerRow>
                </InnerContainer>

                <InnerContainer>
                    <Table>
                        <TableHeader border>
                            <Column flex="2">Tidspunkt</Column>
                            <Column flex="3">Tittel</Column>
                            <Column flex="4">Beskrivelse</Column>
                            <Column flex="0 22px" title="Elementet er synlig på infoskjermen"></Column>
                            <Column flex="0 22px" title="Trykk for å fjerne elementet"></Column>
                        </TableHeader>
                    </Table>

                    {
                        agendaList.map(entry => {
                            return (
                                <AgendaEntry reloadAgendaList={reloadAgendaList} entry={entry} key={entry.uuid}/>
                            )
                        })
                    }
                </InnerContainer>
            </DashboardContent>

            <DashboardContent visible={activeContent == 2}>
                <InnerContainer>
                    <IFrameContainer src="https://info.phoenixlan.no/" />
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
};


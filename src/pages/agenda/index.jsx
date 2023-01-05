import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

import { Agenda, getCurrentEvent } from '@phoenixlan/phoenix.js'

import { PageLoading } from "../../components/pageLoading"

import { FormInput } from '../../components/form';
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardTitle, IFrameContainer, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputElement, InputLabel } from '../../components/dashboard';
import { faEye, faEyeSlash, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Column, IconContainer, InnerColumnCenter, SelectableRow, Table, TableHeader } from '../../components/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


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
        return (
            <PageLoading />
        )
    } else {
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
                            Opprett et nytt agenda element
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
                                            <InputElement type="datetime-local" {...register("time")} />
                                        </InputContainer>
                                    </>
                                    <FormInput type="submit" name=''></FormInput>
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
                                <Column center flex="0 24px" title="Statusikon: Viser om elementet er synlig på infoskjermen eller ikke"><InnerColumnCenter>S</InnerColumnCenter></Column>
                                <Column center flex="0 24px" title="Funksjon: Fjerner elementet"><InnerColumnCenter>F</InnerColumnCenter></Column>
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


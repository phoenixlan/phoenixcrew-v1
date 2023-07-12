import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

import { Agenda, getCurrentEvent } from '@phoenixlan/phoenix.js'

import { PageLoading } from "../../../components/pageLoading"

import { FormInput } from '../../../components/form';
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardTitle, IFrameContainer, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputElement, InputLabel } from '../../../components/dashboard';
import { faEye, faEyeSlash, faTrash, faExternalLinkAlt, faThumbtack, faPlay, faMinus } from '@fortawesome/free-solid-svg-icons';
import { TableCell, IconContainer, InnerColumnCenter, SelectableTableRow, Table, TableHead, TableRow, TableBody } from '../../../components/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router';
import { Button } from '../../../components/button';
import { newWindow } from '../../../components/windows';
import { NewAgendaEntry, newAgendaEntry } from '../../../components/windows/types/agenda/newAgendaEntry';
import { EditAgendaEntry } from '../../../components/windows/types/agenda/editAgendaEntry';

const AgendaEntry = ({ entry, reloadAgendaList, func}) => {
    let history = useHistory();

    const deleteEntry = async () => {
        if(!await Agenda.deleteAgendaEntry(entry.uuid)) {
            console.log("uwu fuckie wuckie");
        }
        await reloadAgendaList();
    }

    return (
        <SelectableTableRow onClick={func}>
            <TableCell flex="0 1.3rem"  mobileHide center   ><IconContainer hidden={new Date(entry.time*1000) < (Date.now() - 5 * 60000)} color="#388e3c"><FontAwesomeIcon icon={faPlay} title="Elementet er innenfor tidsrommet til hva infoskjermen skal vise, og vises." /></IconContainer><IconContainer hidden={new Date(entry.time*1000) > (Date.now() - 5 * 60000)} color="#ef6c00"><FontAwesomeIcon icon={faMinus} title="Elementet er utenfor tidsrommet til hva infoskjermen skal vise, og er skjult." /></IconContainer></TableCell>
            <TableCell flex="0 1.3rem"  mobileHide center   ><IconContainer hidden={!entry.sticky} color="#d32f2f"><FontAwesomeIcon icon={faThumbtack} title="Elementet er festet og vises øverst på infoskjermene." /></IconContainer></TableCell>
            <TableCell flex="0 1px"     mobileHide fillGray />
            <TableCell flex="2"         mobileFlex="3"      >{ entry.title }</TableCell>
            <TableCell flex="3"         mobileHide          >{ entry.description }</TableCell>
            <TableCell flex="1"         mobileFlex="2"      >{ new Date(entry.time*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) }</TableCell>
            <TableCell flex="1"         mobileFlex="2"      >{ entry.newTime ? new Date(entry.newTime*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) : null}</TableCell>
        </SelectableTableRow>
    )
}



export const AgendaList = (props) => {
    const sortingMethods = {
        TIME_ASC: (a, b) => a.time - b.time,
        TIME_DESC: (a, b) => b.time - a.time,
    }

    const [activeContent, setActiveContent] = useState(1);
    const [currentEvent, setCurrentEvent] = useState(undefined);

    const [sortingMethod, setSortingMethod] = useState(sortingMethods.TIME_ASC);
    const [agendaList, setAgendaList] = useState([]);

    const [ window, setWindow ] = useState([]);    
    const [loading, setLoading] = useState(true);

    const reloadAgendaList = async () => {
        setCurrentEvent(await getCurrentEvent());
        const getAgendaList = await Agenda.getAgenda();
        if(getAgendaList) {
            const sortedList = [...getAgendaList].sort(sortingMethod);
            setAgendaList(sortedList);
            setLoading(false);
        }
    }
    
    useEffect(async () => {
        reloadAgendaList().catch((e) => {
            console.log(e);
        })
    }, []);

    const reload = async () => {
        await reloadAgendaList();
    }

    if(loading) {
        return (
            <PageLoading />
        )
    } else {
        return (
            
            <>
                {window}
                <DashboardHeader>
                    <DashboardTitle>
                        Program
                    </DashboardTitle>
                </DashboardHeader>

                <DashboardBarSelector border>
                    <DashboardBarElement active={activeContent == 1} onClick={() => setActiveContent(1)}>Oppsett</DashboardBarElement>
                    <DashboardBarElement onClick={() => window.open("https://info.phoenixlan.no/")}>Infoskjerm visning <IconContainer><FontAwesomeIcon icon={faExternalLinkAlt} title="Trykk for å slette elementet" /></IconContainer></DashboardBarElement>
                </DashboardBarSelector>

                <DashboardContent visible={activeContent == 1}>
                    <InnerContainer>
                        Program er hva som skal skje under arrangementet.<br />
                        Legg til dato og tid, tittel og beskrivelse for hva som skal skje.<br /><br />

                        Informasjonen du legger inn vises på hovedsiden under tidsplan og på infosiden/infoskjermene som blir satt opp på lokasjonen.
                    </InnerContainer>

                    <InnerContainer>
                        <Button onClick={() => setWindow(newWindow({title: "Opprett nytt element", subtitle: currentEvent.name, Component: NewAgendaEntry, exitFunction: () => {setWindow(false); reload()}}))}>Opprett nytt element</Button>                        {/*<Button onClick={() => setWindow(newWindow({title: "Legg til oppføring i programmet", subtitle: "123123123123", }))}>Opprett nytt element</Button>*/}
                    </InnerContainer>

                    <InnerContainer>
                    </InnerContainer>

                    <InnerContainer>
                        <Table>
                            <TableHead border>
                                <TableRow>
                                    <TableCell as="th" center   flex="0 1.3rem" mobileHide          title="Indikerer om elementet er synlig på infoskjermene eller ikke."><InnerColumnCenter>...</InnerColumnCenter></TableCell>
                                    <TableCell as="th" center   flex="0 1.3rem" mobileHide          title="Indikerer om elementet er festet øverst på infoskjermene eller ikke."><InnerColumnCenter>...</InnerColumnCenter></TableCell>
                                    <TableCell as="th"          flex="0 1px"    mobileHide fillGray />
                                    <TableCell as="th"          flex="2"        mobileFlex="3"      onClick={() => setSortingMethod}>Tittel</TableCell>
                                    <TableCell as="th"          flex="3"        mobileHide          >Beskrivelse</TableCell>
                                    <TableCell as="th"          flex="1"        mobileFlex="2"      onClick={() => setSortingMethod(sortingMethods.TIME_DESC)}>Tidspunkt</TableCell>
                                    <TableCell as="th"          flex="1"        mobileFlex="2"      >Avvikende<br/>tidspunkt</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody columnReverse>
                                {
                                    agendaList.map(entry => {
                                        return (
                                            <AgendaEntry reloadAgendaList={reloadAgendaList} entry={entry} key={entry.uuid} func={() => setWindow(newWindow({title: "Endre oppføring", subtitle: currentEvent.name, Component: EditAgendaEntry, exitFunction: () => {setWindow(false); reload()}, entries: entry}))} />
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
};


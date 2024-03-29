import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

import { Agenda, getCurrentEvent } from '@phoenixlan/phoenix.js'

import { PageLoading } from "../../../components/pageLoading"

import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardTitle, InnerContainer, InnerContainerRow, PanelButton } from '../../../components/dashboard';
import { TableCell, IconContainer, InnerColumnCenter, SelectableTableRow, Table, TableHead, TableRow, TableBody } from '../../../components/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack, faPlay, faMinus, faPlus, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { newWindow } from '../../../components/windows';
import { NewAgendaEntry } from '../../../components/windows/types/agenda/newAgendaEntry';
import { EditAgendaEntry } from '../../../components/windows/types/agenda/editAgendaEntry';

const AgendaEntry = ({ entry, func}) => {
    const [ active, setActive ]         = useState(false);
    const [ pinned, setPinned ]         = useState(undefined);
    const [ deviating, setDeviating ]   = useState(undefined); 

    useEffect(() => {
        // Set active state depending on these conditions:
        setActive(
            Date.now() - 5 * 60000 < new Date(entry.deviating_time * 1000) ||
            Date.now() - 5 * 60000 < new Date(entry.time * 1000)
        )

        // Set pinned state depending on these conditions:
        setPinned(
            entry.pinned
        )

        // Set deviating state depending on these conditions:
        setDeviating(
            entry.deviating_time_unknown ||
            entry.cancelled ||
            entry.deviating_information ||
            entry.deviating_location ||
            entry.deviating_time
        )
    }, [entry]);
    return (
        <SelectableTableRow onClick={func}>
            <TableCell flex="0 1.3rem"  mobileHide center   ><IconContainer hidden={!active} color="#388e3c"><FontAwesomeIcon icon={faPlay} title="Elementet er innenfor tidsrommet til hva infoskjermen skal vise, og vises." /></IconContainer><IconContainer hidden={active} color="#ef6c00"><FontAwesomeIcon icon={faMinus} title="Elementet er utenfor tidsrommet til hva infoskjermen skal vise, og er skjult." /></IconContainer></TableCell>
            <TableCell flex="0 1.3rem"  mobileHide center   ><IconContainer hidden={!pinned} color="#d32f2f"><FontAwesomeIcon icon={faThumbtack} title="Elementet er festet og vises øverst på infoskjermene." /></IconContainer></TableCell>
            <TableCell flex="0 1.3rem"  mobileHide center   ><IconContainer hidden={!deviating} color="#ef6c00"><FontAwesomeIcon icon={faCircleExclamation} title="Elementet har et eller flere endringer, åpne elementet for å se." /></IconContainer></TableCell>
            <TableCell flex="0 1px"     mobileHide fillGray />
            <TableCell flex="2"         mobileFlex="3"      >{ entry.title }</TableCell>
            <TableCell flex="3"         mobileHide          >{ entry.description }</TableCell>
            <TableCell flex="1"         mobileFlex="2"      >{ new Date(entry.time*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) }</TableCell>
            <TableCell flex="1"         mobileFlex="2"      bold>{ entry.cancelled ? `Avlyst` : entry.deviating_time_unknown ? "Ubestemt tidspunkt" : entry.deviating_time ? new Date(entry.deviating_time*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) : null}</TableCell>
        </SelectableTableRow>
    )
}

export const AgendaList = (props) => {
    const [activeContent, setActiveContent] = useState(1);
    const [currentEvent, setCurrentEvent] = useState(undefined);

    const [agendaList, setAgendaList] = useState([]);

    const [ window, setWindow ] = useState([]);    
    const [loading, setLoading] = useState(true);

    const reloadAgendaList = async () => {
        setCurrentEvent(await getCurrentEvent());
        const getAgendaList = await Agenda.getAgenda();
        if (getAgendaList) {
            setAgendaList(getAgendaList);
            setLoading(false);
        }
      };
    
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
                </DashboardBarSelector>

                <DashboardContent visible={activeContent == 1}>
                    <InnerContainer>
                        Programmet er hva som skal skje under arrangementet.<br />
                        Legg til dato og tid, tittel og beskrivelse for hva som skal skje.<br /><br />

                        Informasjonen du legger inn vises på hovedsiden under tidsplan og på infosiden/infoskjermene som blir satt opp på lokasjonen.
                    </InnerContainer>

                    <InnerContainerRow nopadding>
                        <InnerContainer flex="1">
                            <PanelButton onClick={() => setWindow(newWindow({title: "Opprett nytt element", subtitle: currentEvent.name, Component: NewAgendaEntry, exitFunction: () => {setWindow(false); reload()}}))} icon={faPlus}>Legg til</PanelButton>
                        </InnerContainer>
                    </InnerContainerRow>

                    <InnerContainer>
                        <Table>
                            <TableHead border>
                                <TableRow>
                                    <TableCell as="th" center   flex="0 1.3rem" mobileHide          title="Indikerer om elementet er synlig på infoskjermene eller ikke."><InnerColumnCenter>...</InnerColumnCenter></TableCell>
                                    <TableCell as="th" center   flex="0 1.3rem" mobileHide          title="Indikerer om elementet er festet øverst på infoskjermene eller ikke."><InnerColumnCenter>...</InnerColumnCenter></TableCell>
                                    <TableCell as="th" center   flex="0 1.3rem" mobileHide          title="Indikerer om elementet har et eller flere endringer."><InnerColumnCenter>...</InnerColumnCenter></TableCell>
                                    <TableCell as="th"          flex="0 1px"    mobileHide fillGray />
                                    <TableCell as="th"          flex="2"        mobileFlex="3"      >Tittel</TableCell>
                                    <TableCell as="th"          flex="3"        mobileHide          >Beskrivelse</TableCell>
                                    <TableCell as="th"          flex="1"        mobileFlex="2"      >Tidspunkt</TableCell>
                                    <TableCell as="th"          flex="1"        mobileFlex="2"      >Nytt<br/>tidspunkt</TableCell>
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


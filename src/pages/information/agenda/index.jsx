import React, { useState, useEffect } from 'react';

import { Agenda, getCurrentEvent } from '@phoenixlan/phoenix.js'

import { PageLoading } from "../../../components/pageLoading"

import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardTitle, InnerContainer, InnerContainerRow, PanelButton } from '../../../components/dashboard';
import { TableCell, IconContainer, InnerColumnCenter, SelectableTableRow, Table, TableHead, TableRow, TableBody } from '../../../components/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack, faPlay, faMinus, faPlus, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { newWindow } from '../../../components/windows';
import { NewAgendaEntry } from '../../../components/windows/types/agenda/newAgendaEntry';
import { EditAgendaEntry } from '../../../components/windows/types/agenda/editAgendaEntry';
import { Notice } from '../../../components/containers/notice';

const AgendaEntry = ({ entry, func}) => {
    const pinned = entry.pinned;

    const entry_planned = 
        entry.duration
        ? entry.deviating_time
          ? Date.now() < entry.deviating_time * 1000 
          : Date.now() < entry.time * 1000
        : entry.deviating_time
          ? Date.now() < entry.deviating_time * 1000 + 10 * 60000
          : Date.now() < entry.time * 1000 + 10 * 60000

    const entry_active =
        entry.duration
        ? entry.deviating_time
          ? Date.now() > entry.deviating_time * 1000 &&
            Date.now() < (entry.deviating_time * 1000 + (entry.duration + 10) * 60000)
          : Date.now() > entry.time * 1000 &&
            Date.now() < (entry.time * 1000 + (entry.duration + 10) * 60000)
        : false

    const entry_finished =
        entry.duration
        ? entry.deviating_time
          ? Date.now() > (entry.deviating_time * 1000 + (entry.duration + 10) * 60000)
          : Date.now() > (entry.time * 1000 + (entry.duration + 10) * 60000)
        : Date.now() > entry.time * 1000 + 10 * 60000

    const deviating = 
        entry.deviating_time_unknown || 
        entry.deviating_information || 
        entry.deviating_location || 
        entry.deviating_time ||
        entry.cancelled;

    return (
        <SelectableTableRow onClick={func}>
            <TableCell flex="0 1.3rem"  mobileHide center   >
                <IconContainer hidden={!entry_planned} color="#388e3c">
                    <FontAwesomeIcon icon={faClock} title="Oppføringen vises på skjermen, og er oppført under 'Kommende hendelser'" />
                </IconContainer>
                <IconContainer hidden={!entry_active} color="#388e3c">
                    <FontAwesomeIcon icon={faPlay} title="Oppføringen vises på skjermen, og er oppført under 'Dette skjer nå'" />
                </IconContainer>
                <IconContainer hidden={!entry_finished} color="#ef6c00">
                    <FontAwesomeIcon icon={faMinus} title="Oppføringen har passert start og, eller slutt tidspunktet og skjules." />
                </IconContainer>
            </TableCell>
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

export const AgendaList = () => {
    const [activeContent, setActiveContent] = useState(1);
    
    const [ currentEvent, setCurrentEvent ] = useState(undefined);
    const [ agendaList, setAgendaList ] = useState([]);

    const [ window, setWindow ] = useState([]);    
    const [ notice, setNotice ] = useState(false);
    const [ loading, setLoading ] = useState(true);

    const reloadAgendaList = async () => {

        // Attempt to get current event, and get the agenda list based on current event. Create a warning notice if no event is found.
        const currentEvent = await getCurrentEvent();
        if(currentEvent) {
            setCurrentEvent(currentEvent);
            setAgendaList(await Agenda.getAgenda());
        } else {
            setNotice({"type": "warning", "title": "Oops, vi mangler et fremtidig arrangement!", "description": "Det eksisterer for øyeblikket ingen nye arrangementer frem i tid. Dette gjør at du ikke får hentet programmet, eller laget nye oppføringer til programmet. Opprett et nytt arrangement under Arrangementer i sidemenyen for å fortsette."});
        }

        // Remove loading screen when logic is done
        setLoading(false);
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
                        Programplanlegger
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

                    {
                    notice
                    ?   <Notice type={notice.type}>
                            <b>{notice.title}</b>
                            {notice.description}
                        </Notice>
                    :   <></>
                    }

                    <InnerContainerRow nopadding>
                        <InnerContainer flex="1">
                            <PanelButton disabled={notice} onClick={() => setWindow(newWindow({title: "Opprett nytt element", subtitle: currentEvent.name, Component: NewAgendaEntry, exitFunction: () => {setWindow(false); reload()}}))} icon={faPlus}>Legg til</PanelButton>
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
                                    agendaList
                                    .map(entry => {
                                        return (
                                            <AgendaEntry 
                                                key={entry.uuid}
                                                entry={entry}
                                                reloadAgendaList={reloadAgendaList}   
                                                
                                                func={() => setWindow(newWindow({title: "Endre oppføring", subtitle: currentEvent.name, Component: EditAgendaEntry, exitFunction: () => {setWindow(false); reload()}, entries: entry}))} 
                                            />
                                        )
                                    })
                                    .reverse()
                                }

                                
                            </TableBody>
                        </Table>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
};


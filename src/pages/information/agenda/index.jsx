import { useState, useEffect, useContext } from 'react';

import { Agenda, getCurrentEvent } from '@phoenixlan/phoenix.js'

import { PageLoading } from "../../../components/pageLoading"
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardTitle, InnerContainer, InnerContainerRow, PanelButton } from '../../../components/dashboard';
import { TableCell, IconContainer, InnerColumnCenter, SelectableTableRow, Table, TableHead, TableRow, TableBody } from '../../../components/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack, faPlay, faMinus, faPlus, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationContext } from '../../../components/authentication';
import { TimestampToDateTime } from "../../../components/timestampToDateTime";

const AgendaEntry = ({ entry }) => {
    const [ active, setActive ] = useState(false);
    const [ pinned, setPinned ] = useState(undefined);
    const [ deviating, setDeviating ] = useState(undefined); 

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
        <>
            <TableCell flex="0 1.3rem" mobileHide center   ><IconContainer hidden={!active} color="#388e3c"><FontAwesomeIcon icon={faPlay} title="Elementet er innenfor tidsrommet til hva infoskjermen skal vise, og vises." /></IconContainer><IconContainer hidden={active} color="#616161"><FontAwesomeIcon icon={faMinus} title="Elementet er utenfor tidsrommet til hva infoskjermen skal vise, og er skjult." /></IconContainer></TableCell>
            <TableCell flex="0 1.3rem" mobileHide center   ><IconContainer hidden={!pinned} color="#d32f2f"><FontAwesomeIcon icon={faThumbtack} title="Elementet er festet og vises øverst på infoskjermene." /></IconContainer></TableCell>
            <TableCell flex="0 1.3rem" mobileHide center   ><IconContainer hidden={!deviating} color="#ef6c00"><FontAwesomeIcon icon={faCircleExclamation} title="Elementet har et eller flere endringer, åpne elementet for å se." /></IconContainer></TableCell>
            <TableCell flex="0 1px" mobileHide fillGray />
            <TableCell flex="2" mobileFlex="3" >{ entry.title }</TableCell>
            <TableCell flex="3" mobileHide>{ entry.description }</TableCell>
            <TableCell flex="1" mobileFlex="2">{ TimestampToDateTime(entry.time, "DD_MM_YYYY_HH_MM")}</TableCell>
            <TableCell flex="1" mobileHide bold>{ entry.cancelled ? `Avlyst` : entry.deviating_time_unknown ? "Ubestemt tidspunkt" : entry.deviating_time ? TimestampToDateTime(entry.deviating_time, "DD_MM_YYYY_HH_MM") : null}</TableCell>
        </>
    )
}

export const AgendaList = () => {

    let history = useHistory();
    
    const [ activeContent, setActiveContent ] = useState(1);
    const [ agendaList, setAgendaList ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    // Import the following React contexts:
    const authContext = useContext(AuthenticationContext);
    const agendaManagement = authContext.roles.includes("admin" || "evemt_admin" || "info_admin" || "compo_admin");

    const reloadAgendaList = async () => {
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

    if(loading) {
        return (
            <PageLoading />
        )
    } else {
        return (
            
            <>
                <DashboardHeader>
                    <DashboardTitle>
                        Program
                    </DashboardTitle>
                </DashboardHeader>

                <DashboardBarSelector border>
                    <DashboardBarElement active={activeContent == 1} onClick={() => setActiveContent(1)}>Oppsett</DashboardBarElement>
                </DashboardBarSelector>

                <DashboardContent visible={activeContent == 1}>
                    <InnerContainerRow nopadding>
                        <InnerContainer flex="1">
                            <PanelButton onClick={() => history.push('/information/schedule/create')} icon={faPlus} disabled={!agendaManagement}>Opprett programpost</PanelButton>
                        </InnerContainer>
                    </InnerContainerRow>

                    <InnerContainer>
                        Programmet er hva som skal skje gjennom arrangementet og vil vises på nettsidene og infoskjermen våres.<br />
                        Opprett programposter over ved å legge til dato og tid, tittel og beskrivelse for hva som skal skje.<br />
                        Ved større endringer eller problemer så kan programpostene endres med nye tider, varseltekster, eller avlyses.
                    </InnerContainer>

                    <InnerContainer>
                        <Table>
                            <TableHead border>
                                <TableRow>
                                    <TableCell as="th" center flex="0 1.3rem" mobileHide title="Indikerer om elementet er synlig på infoskjermene eller ikke."><InnerColumnCenter>...</InnerColumnCenter></TableCell>
                                    <TableCell as="th" center flex="0 1.3rem" mobileHide title="Indikerer om elementet er festet øverst på infoskjermene eller ikke."><InnerColumnCenter>...</InnerColumnCenter></TableCell>
                                    <TableCell as="th" center flex="0 1.3rem" mobileHide title="Indikerer om elementet har et eller flere endringer."><InnerColumnCenter>...</InnerColumnCenter></TableCell>
                                    <TableCell as="th" flex="0 1px" mobileHide fillGray />
                                    <TableCell as="th" flex="2" mobileFlex="3" >Tittel</TableCell>
                                    <TableCell as="th" flex="3" mobileHide >Beskrivelse</TableCell>
                                    <TableCell as="th" flex="1" mobileFlex="2" >Tidspunkt</TableCell>
                                    <TableCell as="th" flex="1" mobileHide>Nytt<br/>tidspunkt</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody columnReverse>
                                {
                                    agendaList.map(entry => {
                                        return (
                                            <SelectableTableRow onClick={() => history.push("/information/schedule/" + entry.uuid)}>
                                                <AgendaEntry reloadAgendaList={reloadAgendaList} entry={entry} key={entry.uuid} />
                                            </SelectableTableRow>
                                            
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


import React, { useState, useEffect } from "react";
import { Event } from '@phoenixlan/phoenix.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InputCheckbox } from "../../components/dashboard";
import { Table, SelectableTableRow, TableCell, TableHead, IconContainer } from "../../components/table";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { PageLoading } from "../../components/pageLoading";

export const TicketTransferList = () => {
    const [ ticketTransfers, setTicketTransfers ] = useState([]);
    const [ loading, setLoading ] = useState(true)

    const [visibleUUID, setVisibleUUID] = useState(false);

    let history = useHistory();

    useEffect(() => {
        const inner = async () => {
            setTicketTransfers(await Event.getTicketTransfers());
            setLoading(false);
        }

        inner();

        const interval = setInterval(() => {
            inner();
        }, 5000);

        return () => {
            clearInterval(interval);
        }
    }, []);


    if(loading) {
        return (
            <PageLoading />
        )
    }
    
    else {
        return (
            <>
                <DashboardHeader border>
                    <DashboardTitle>
                        Aktive kjøp
                    </DashboardTitle>
                    <DashboardSubtitle>
                        {ticketTransfers.length} kjøp pågående
                    </DashboardSubtitle>
                </DashboardHeader>
                <DashboardContent>
                    <InnerContainer>
                        <InputCheckbox label="Vis bruker UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                    </InnerContainer>
                    <InnerContainer>
                        <Table>
                            <TableHead border>
                                <TableCell flex="10" visible={!visibleUUID}>UUID</TableCell>
                                <TableCell flex="6">Bruker</TableCell>
                                <TableCell flex="4">Kjøp påbegynt</TableCell>
                                <TableCell flex="4">Kjøp utløper</TableCell>
                                <TableCell flex="3">Antall billetter</TableCell>
                                <TableCell flex="2">Pris</TableCell>
                                <TableCell center flex="0 24px" title="Trykk for å åpne"><IconContainer>...</IconContainer></TableCell>
                            </TableHead>
                        </Table>
                        
                        {
                            ticketTransfers.map((session) => (
                                <SelectableTableRow onClick={e => {history.push(`/user/${session.user_uuid}`)}}>
                                    <TableCell flex="10" consolas visible={!visibleUUID}>{session.uuid}</TableCell>
                                    <TableCell flex="6">...</TableCell>
                                    <TableCell flex="4">{new Date(session.created*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) }</TableCell>
                                    <TableCell flex="4">{new Date(session.expires*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) }</TableCell>
                                    <TableCell flex="3">{session.entries.reduce((prev, cur) => prev+cur.amount, 0)}</TableCell>
                                    <TableCell flex="2">{session.total} ,-</TableCell>
                                    <TableCell flex="0 24px" center><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
                                </SelectableTableRow>
                            ))
                        }
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
import React, { useState, useEffect } from "react";
import { getActiveStoreSessions } from '@phoenixlan/phoenix.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InputCheckbox } from "../../components/dashboard";
import { Table, SelectableRow, Column, TableHeader, IconContainer } from "../../components/table";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { PageLoading } from "../../components/pageLoading";

export const StoreSessionList = () => {
    const [ storeSessions, setStoreSessions ] = useState([]);
    const [ loading, setLoading ] = useState(true)

    const [visibleUUID, setVisibleUUID] = useState(false);

    let history = useHistory();

    useEffect(() => {
        const inner = async () => {
            setStoreSessions(await getActiveStoreSessions());
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
                        {storeSessions.length} kjøp pågående
                    </DashboardSubtitle>
                </DashboardHeader>
                <DashboardContent>
                    <InnerContainer>
                        <InputCheckbox label="Vis bruker UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                    </InnerContainer>
                    <InnerContainer>
                        <Table>
                            <TableHeader border>
                                <Column flex="10" visible={!visibleUUID}>UUID</Column>
                                <Column flex="6">Bruker</Column>
                                <Column flex="4">Kjøp påbegynt</Column>
                                <Column flex="4">Kjøp utløper</Column>
                                <Column flex="3">Antall billetter</Column>
                                <Column flex="2">Pris</Column>
                                <Column center flex="0 24px" title="Trykk for å åpne"><IconContainer>...</IconContainer></Column>
                            </TableHeader>
                        </Table>
                        
                        {
                            storeSessions.map((session) => (
                                <SelectableRow onClick={e => {history.push(`/user/${session.user_uuid}`)}}>
                                    <Column flex="10" consolas visible={!visibleUUID}>{session.uuid}</Column>
                                    <Column flex="6">...</Column>
                                    <Column flex="4">{new Date(session.created*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) }</Column>
                                    <Column flex="4">{new Date(session.expires*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) }</Column>
                                    <Column flex="3">{session.entries.reduce((prev, cur) => prev+cur.amount, 0)}</Column>
                                    <Column flex="2">{session.total} ,-</Column>
                                    <Column flex="0 24px" center><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                                </SelectableRow>
                            ))
                        }
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
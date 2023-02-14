import React, { useState, useEffect } from "react";
import { getActiveStoreSessions } from '@phoenixlan/phoenix.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InputCheckbox } from "../../components/dashboard";
import { Table, SelectableTableRow, TableCell, TableHead, IconContainer, TableBody, TableRow } from "../../components/table";
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
                    <InnerContainer mobileHide>
                        <InputCheckbox label="Vis bruker UUID" value={visibleUUID} onChange={() => setVisibleUUID(!visibleUUID)} />
                    </InnerContainer>
                    <InnerContainer>
                        <Table>
                            <TableHead border>
                                <TableRow>
                                    <TableCell flex="10" mobileHide visible={!visibleUUID}>UUID</TableCell>
                                    <TableCell flex="6" mobileFlex="3">Bruker</TableCell>
                                    <TableCell flex="4" mobileHide>Kjøp påbegynt</TableCell>
                                    <TableCell flex="4" mobileFlex="3">Kjøp utløper</TableCell>
                                    <TableCell flex="3" mobileFlex="1">Antall billetter</TableCell>
                                    <TableCell flex="2" mobileHide>Pris</TableCell>
                                    <TableCell center flex="0 24px" mobileHide title="Trykk for å åpne"><IconContainer>...</IconContainer></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    storeSessions.map((session) => (
                                        <SelectableTableRow onClick={e => {history.push(`/user/${session.user_uuid}`)}}>
                                            <TableCell flex="10" mobileHide consolas visible={!visibleUUID}>{session.uuid}</TableCell>
                                            <TableCell flex="6" mobileFlex="3">...</TableCell>
                                            <TableCell flex="4" mobileHide>{new Date(session.created*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) }</TableCell>
                                            <TableCell flex="4" mobileFlex="3">{new Date(session.expires*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) }</TableCell>
                                            <TableCell flex="3" mobileFlex="1">{session.entries.reduce((prev, cur) => prev+cur.amount, 0)}</TableCell>
                                            <TableCell flex="2" mobileHide>{session.total} ,-</TableCell>
                                            <TableCell flex="0 24px" mobileHide center><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
                                        </SelectableTableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
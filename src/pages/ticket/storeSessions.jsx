import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InputCheckbox, SpanLink } from "../../components/dashboard";
import { Table, SelectableTableRow, TableCell, TableHead, IconContainer, TableBody, TableRow, InnerTableRow, TableCellSpacer, InnerTable } from "../../components/table";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { PageLoading } from "../../components/pageLoading";

import { useActiveStoreSessions } from "../../hooks/storeSessions/useActiveStoreSessions";

export const StoreSessionList = () => {
    const { data: storeSessions = [], isLoading: loading } = useActiveStoreSessions({ refetchInterval: 5000 });

    const [visibleUUID, setVisibleUUID] = useState(false);

    let history = useHistory();


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
                        <Table>
                            <TableHead border>
                                <TableRow>
                                    <TableCell as="th" flex="9" mobileHide visible={!visibleUUID}>UUID <SpanLink onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? "(Skjul UUID)" : null}</SpanLink></TableCell>
                                    <TableCell as="th" flex="8" mobileFlex="3">Bruker <SpanLink mobileHide onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? null : "(Vis UUID)"}</SpanLink></TableCell>
                                    <TableCell as="th" flex="4" mobileHide>Kjøp<br/>påbegynt</TableCell>
                                    <TableCell as="th" flex="4" mobileFlex="3">Kjøp<br/>utløper</TableCell>
                                    <TableCell as="th" flex="3" center mobileFlex="1">Antall<br/>billetter</TableCell>
                                    <TableCell as="th" flex="2" mobileHide>Pris</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody rowgap>
                                {
                                    storeSessions.map((session) => (
                                        <TableRow norowgap>
                                                <TableCell flex="9" mobileHide consolas visible={!visibleUUID}>{session.uuid}</TableCell>
                                                <TableCell flex="8" mobileFlex="3"><SpanLink onClick={() => history.push(`/user/${session.user_uuid}`)}>{session.name}</SpanLink></TableCell>
                                                <TableCell flex="4" mobileHide>{new Date(session.created*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) }</TableCell>
                                                <TableCell flex="4" mobileFlex="3">{new Date(session.expires*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'})}</TableCell>
                                                <TableCell flex="3" center mobileFlex="1">{session.entries.reduce((prev, cur) => prev+cur.amount, 0)}</TableCell>
                                                <TableCell flex="2" mobileHide>{session.total} ,-</TableCell>
                                                <InnerTable>
                                                    {
                                                        session.entries.map((entry) => (
                                                            <InnerTableRow>
                                                                <TableCell flex="9" mobileHide visible={!visibleUUID}/>
                                                                <TableCell small flex="8" mobileFlex="3"><TableCellSpacer />{entry.ticket_type.name}</TableCell>
                                                                <TableCell flex="4" mobileHide />
                                                                <TableCell flex="4" mobileFlex="3"/>
                                                                <TableCell small flex="3" center mobileFlex="1">{entry.amount}</TableCell>
                                                                <TableCell small flex="2" mobileHide>{entry.ticket_type.price * entry.amount} ,-</TableCell>
                                                            </InnerTableRow>
                                                        ))
                                                    }
                                                </InnerTable>
                                        </TableRow>
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

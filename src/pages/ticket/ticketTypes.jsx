import React , { useEffect, useState } from "react";
import { TicketType, getCurrentEvent, getEventTicketTypes } from "@phoenixlan/phoenix.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCheck, faCircleCheck }  from '@fortawesome/free-solid-svg-icons'
import { PageLoading } from "../../components/pageLoading"
import { Table, TableRow, TableCell, TableHead, IconContainer, TableBody, SelectableTableRow } from "../../components/table";
import { DashboardContent, DashboardHeader, DashboardTitle, InnerContainer, SpanLink } from "../../components/dashboard";

export const TicketTypeList = () => {
    const [ticketTypes, setTicketTypes] = useState([]);
    const [eventTicketTypeUuids, setEventTicketTypeUuids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ visibleUUID, setVisibleUUID ] = useState(false);

    useEffect(async () => {
        setLoading(true);
        const [ticketTypes, currentEvent] = await Promise.all([
            TicketType.getTicketTypes(),
            getCurrentEvent(),
        ]);
        const eventTicketTypes = await getEventTicketTypes(currentEvent.uuid);
        setTicketTypes(ticketTypes);
        setEventTicketTypeUuids(eventTicketTypes.map(tt => tt.uuid));
        setLoading(false);
    }, []);

    if(loading) {
        return (<PageLoading />)
    }

    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Billett-typer
                </DashboardTitle>
            </DashboardHeader>

            <DashboardContent>
                <InnerContainer>
                    <Table>
                        <TableHead border>
                            <TableRow>
                                <TableCell as="th" flex="8" mobileHide visible={!visibleUUID}>UUID <SpanLink onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? "(Skjul UUID)" : null}</SpanLink></TableCell>
                                <TableCell as="th" flex="7">Navn <SpanLink mobileHide onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? null : "(Vis UUID)"}</SpanLink></TableCell>
                                <TableCell as="th" flex="2" mobileHide>Pris</TableCell>
                                <TableCell as="th" flex="2" mobileHide center>Gir<br/>adgang</TableCell>
                                <TableCell as="th" flex="2" mobileHide center>Gir<br/>plass</TableCell>
                                <TableCell as="th" flex="2" mobileHide center>Gir<br/>medlemskap</TableCell>
                                <TableCell as="th" flex="2" mobileHide center>I bruk</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                ticketTypes.sort((a, b) => b.price - a.price).map((ticketType) => {
                                    return (
                                        <TableRow key={ticketType.uuid} active={!eventTicketTypeUuids.includes(ticketType.uuid)}>
                                            <TableCell consolas flex="8" mobileHide visible={!visibleUUID}>{ ticketType.uuid }</TableCell>
                                            <TableCell flex="7">{ ticketType.name }</TableCell>
                                            <TableCell flex="2" mobileHide>{ ticketType.price } ,-</TableCell>
                                            <TableCell flex="2" mobileHide center>{ ticketType.grants_admission ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
                                            <TableCell flex="2" mobileHide center>{ ticketType.seatable ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
                                            <TableCell flex="2" mobileHide center>{ ticketType.grants_membership ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
                                            <TableCell flex="2" mobileHide center>{ eventTicketTypeUuids.includes(ticketType.uuid) ? <IconContainer color="#388e3c"><FontAwesomeIcon icon={faCircleCheck}/></IconContainer> : null }</TableCell>
                                        </TableRow>
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

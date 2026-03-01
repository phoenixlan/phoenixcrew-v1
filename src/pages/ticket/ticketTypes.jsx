import React , { useEffect, useState } from "react";
import { TicketType, getCurrentEvent, getEventTicketTypes } from "@phoenixlan/phoenix.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck }  from '@fortawesome/free-solid-svg-icons'
import { PageLoading } from "../../components/pageLoading"
import { Table, TableRow, TableCell, TableHead, IconContainer, TableBody } from "../../components/table";
import { DashboardContent, DashboardHeader, DashboardTitle, InnerContainer } from "../../components/dashboard";

export const TicketTypeList = () => {
    const [ticketTypes, setTicketTypes] = useState([]);
    const [eventTicketTypeUuids, setEventTicketTypeUuids] = useState([]);
    const [loading, setLoading] = useState(true);

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
                                <TableCell as="th" flex="6">Navn</TableCell>
                                <TableCell as="th" flex="3" mobileHide>Pris</TableCell>
                                <TableCell as="th" flex="3" mobileHide>Gir adgang</TableCell>
                                <TableCell as="th" flex="3" mobileHide>Gir plass</TableCell>
                                <TableCell as="th" flex="3" mobileHide>Gir medlemskap</TableCell>
                                <TableCell as="th" flex="3">I bruk</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                ticketTypes.map((ticketType) => {
                                    return (
                                        <TableRow key={ticketType.uuid}>
                                            <TableCell flex="6">{ ticketType.name }</TableCell>
                                            <TableCell flex="3" mobileHide>{ ticketType.price },-</TableCell>
                                            <TableCell flex="3" mobileHide>{ ticketType.seatable ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
                                            <TableCell flex="3" mobileHide>{ ticketType.grants_membership ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
                                            <TableCell flex="3" mobileHide>{ ticketType.grants_admission ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
                                            <TableCell flex="3">{ eventTicketTypeUuids.includes(ticketType.uuid) ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
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

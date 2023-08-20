import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import { TicketType, getEvents, getEventTickets, Ticket, User, TicketVoucher} from "@phoenixlan/phoenix.js";
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputLabel, InputSelect } from "../../components/dashboard";
import { FormContainer, FormEntry, FormLabel, FormSelect, FormButton } from '../../components/form';
import { UserSearch } from '../../components/userSearch';
import { Table, Row, TableCell, TableHead, IconContainer, SelectableTableRow, TableRow, TableBody } from "../../components/table";
import { PageLoading } from "../../components/pageLoading";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const TicketVoucherManagement = () => {
    const [ ticketTypes, setTicketTypes ] = useState([]);
    const [ vouchers, setVouchers ] = useState([]);
    const [ events, setEvents] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ selectedUser, setSelectedUser ] = useState("");
    const [ selectedTicketType, setSelectedTicketType ] = useState("");
    const [ selectedEvent, setSelectedEvent ] = useState("");

    let history = useHistory();

    useEffect(async () => {
        await refreshPage();
    }, [])

    const refreshPage = async () => {
        // TODO do we want more freedom?
        const [ types, events, vouchers ] = await Promise.all([
            await TicketType.getTicketTypes(),
            await getEvents(),
            await TicketVoucher.getAllTicketVouchers()
        ])
        setEvents(events);

        const validTypes = types.filter(type => type.price === 0);
        setTicketTypes(validTypes);
        if(validTypes.length > 0) {
            setSelectedTicketType(validTypes[0].uuid);
        }
        setSelectedEvent(events[0].uuid)

        setVouchers(vouchers);
        setLoading(false);
    }

    const onUserSelected = (uuid) => {
        setSelectedUser(uuid);
    }

    const updateTicketType = (event) => {
        console.log(event.target.value);
    }

    const updateEvent = (event) => {
        setSelectedEvent(event.target.value);
    }

    const giveVoucher = async () => {
        console.log(`giving ${selectedTicketType} to ${selectedUser}`);
        await setLoading(true);
        await TicketVoucher.createTicketVoucher(selectedUser, selectedTicketType, selectedEvent);
        //await Ticket.createTicket(selectedUser, selectedTicketType);
        await refreshPage();
    }


    if(loading) {
        return (
            <PageLoading />
        )
    }

    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Billett-gavekort
                </DashboardTitle>
                {   
                    // Check: If there exists a tickettype which is free or not
                    ticketTypes.length === 0 ?
                        null
                    :
                        // Check: If there exists any free tickets during the current event
                        vouchers.length === 0 ?
                            <DashboardSubtitle>
                                Det er for øyeblikket ingen billett-gavekort i sirkulasjon
                            </DashboardSubtitle>
                        :
                            <DashboardSubtitle>
                                {vouchers.length} gavekort eksisterer, hvorav {vouchers.filter((voucher) => voucher.is_used).length} er brukt
                            </DashboardSubtitle>
                    //:
                } 

            </DashboardHeader>

            <DashboardContent>
                <InnerContainer>
                    Billett-gavekort er et gavekort som kan løses inn i en billett på et vilkårlig tidspunkt innen en gitt tidsfrist
                </InnerContainer>
                
                <InnerContainer>
                    <InnerContainerTitle>
                        Opprett og gi ut et nytt gavekort
                    </InnerContainerTitle>

                    <InnerContainerRow>
                        <InnerContainer flex="1">
                            <UserSearch onUserSelected={onUserSelected}/>
                            <InputContainer column extramargin>
                                <InputLabel small>Billett-type</InputLabel>
                                <InputSelect value={selectedTicketType} onChange={updateTicketType}>
                                    {
                                        ticketTypes.map(type => {
                                            return (<option key={type.uuid}>{type.name}</option >)
                                        })
                                    }
                                </InputSelect>
                            </InputContainer>
                            <InputContainer column extramargin>
                                <InputLabel small>Siste arrangement for bruk</InputLabel>
                                <InputSelect value={selectedEvent} onChange={updateEvent}>
                                    {
                                        events.map(event => {
                                            return (<option key={event.uuid} value={event.uuid}>{event.name} ( {new Date(event.start_time*1000).toLocaleString('no-NO', {year: 'numeric', month: '2-digit', day: '2-digit'})} )</option >)
                                        })
                                    }
                                </InputSelect>
                            </InputContainer>
                            <FormButton type="submit" onClick={() => giveVoucher()}>Gi ut billett-gavekort</FormButton>
                        </InnerContainer>
                        <InnerContainer flex="1" mobileHide />
                        <InnerContainer flex="1" mobileHide />
                    </InnerContainerRow>
                </InnerContainer>

                <InnerContainer>
                    <Table>
                        <TableHead border>
                            <TableRow>
                                <TableCell as="th" flex="5" mobileHide>UUID</TableCell>
                                <TableCell as="th" flex="4" mobileFlex="3">Nåværende eier</TableCell>
                                <TableCell as="th" flex="2" mobileFlex="2">Billett-type</TableCell>
                                <TableCell as="th" flex="3" mobileFlex="3">Siste arrangement</TableCell>
                                <TableCell as="th" flex="3" mobileFlex="3">Laget</TableCell>
                                <TableCell as="th" flex="4" mobileFlex="4">Brukt?</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                vouchers.map((voucher) => {
                                    return (
                                        <TableRow>
                                            <TableCell consolas flex="5" mobileHide>{ voucher.uuid }</TableCell>
                                            <TableCell flex="4" mobileFlex="3">{ voucher.recipient_user.firstname + " " + voucher.recipient_user.lastname }</TableCell>
                                            <TableCell flex="2" mobileFlex="2">{ voucher.ticket_type.name }</TableCell>
                                            <TableCell flex="3" mobileHide>{ voucher.last_use_event.name } ({new Date(voucher.last_use_event.start_time*1000).toLocaleString('no-NO', {year: 'numeric', month: '2-digit', day: '2-digit'})})</TableCell>
                                            <TableCell flex="3" mobileHide>{ new Date(voucher.created*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) }</TableCell>
                                            <TableCell flex="4" mobileHide>{ voucher.used ? (
                                                <span>Ja, { new Date(voucher.created*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) } billett #{voucher.ticket.ticket_id}</span>
                                            ) : (<b>Nei</b>) }</TableCell>
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
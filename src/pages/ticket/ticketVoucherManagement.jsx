import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from 'react-router-dom';
import { TicketType, getEvents, getEventTickets, Ticket, User, TicketVoucher} from "@phoenixlan/phoenix.js";
import { CardContainer, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, DropdownCardContainer, DropdownCardContent, DropdownCardHeader, InnerContainer, InnerContainerRow, InnerContainerTextBody, InnerContainerTitle, InputContainer, InputLabel, InputSelect, PanelButton, RowBorder, SpanLink } from "../../components/dashboard";
import { FormContainer, FormEntry, FormLabel, FormSelect, FormButton } from '../../components/form';
import { UserSearch } from '../../components/userSearch';
import { Table, Row, TableCell, TableHead, IconContainer, SelectableTableRow, TableRow, TableBody } from "../../components/table";
import { PageLoading } from "../../components/pageLoading";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Notice } from "../../components/containers/notice";
import { AuthenticationContext } from "../../components/authentication";
import { TimestampToDateTime } from "../../components/timestampToDateTime";

const commonText = {
    "voucherManagement.giveVoucherTitle": "Opprett gavekort",
    "voucherManagement.giveVoucherDescription": [<span>Her kan du opprette og gi ut billett-gavekort, og fungerer ved at du bestemmer type billett som gavekortet kan løses inn i, bestemmer en tidsfrist på når gavekortet må benyttes, og til slutt personen som skal få gavekortet.</span>, <span>Gavekort kan brukes som premie til deltakere som vinner konkurranser, en gode, eller som erstatning hvor brukeren bestemmer når de ønsker å løse inn gavekortet, og du bestemmer fristen for når det må brukes.</span>]
}

export const TicketVoucherManagement = () => {

    let history = useHistory();

    // Import the following React contexts:
    const authContext = useContext(AuthenticationContext);

    // Function availibility control:
    let viewVoucherManagement = false;
    
    const [ visibleUUID, setVisibleUUID ] = useState(false);
    const [ ticketTypes, setTicketTypes ] = useState([]);
    const [ vouchers, setVouchers ] = useState([]);
    const [ events, setEvents] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ selectedUser, setSelectedUser ] = useState("");
    const [ selectedTicketType, setSelectedTicketType ] = useState("");
    const [ selectedEvent, setSelectedEvent ] = useState("");

    const [ isGivingVoucher, setIsGivingVoucher] = useState(false);
    const [ giveVoucherDropdownState, setGiveVoucherDropdownState ] = useState(false);

    // Check if user has "admin" role and make the following functions available:
    if (authContext.roles.includes("admin") || authContext.roles.includes("ticket_admin")) {
        viewVoucherManagement = true;
    }

    const load = async () => {
        if(viewVoucherManagement) {

            // TODO do we want more freedom?

            const [ types, events, vouchers ] = await Promise.all([
                await TicketType.getTicketTypes(),
                await getEvents(),
                await TicketVoucher.getAllTicketVouchers()
            ])

            // Only show ticket types that has a price equal to 0, aka. free tickets
            const validTypes = types.filter(type => type.price === 0);

            // Only show events in the future
            const validEvents = events.filter(event => event.start_time >= Math.floor(Date.now() / 1000))

            setTicketTypes(validTypes);
            setEvents(validEvents);
            setVouchers(vouchers);
        }

        setLoading(false);
    }

    useEffect(async () => {
        await load();
    }, [])

    // Update selected user
    const onUserSelected = (uuid) => {
        setSelectedUser(uuid);
    }

    // Update selected ticket type
    const updateTicketType = (e) => {
        setSelectedTicketType(e.target.value);
    }

    // Update selected event
    const updateEvent = (e) => {
        setSelectedEvent(e.target.value);
    }

    const giveVoucher = async () => {
        if(!selectedUser) {
            alert("No user is selected")
        } else {
            try {
                setIsGivingVoucher(true);
                await TicketVoucher.createTicketVoucher(selectedUser, selectedTicketType, selectedEvent);
                await load();
            } catch(e) {
                alert("An error occured when giving voucher to this user.\n\n" + e);
                console.error("An error occured when creating a new voucher with ticket type (" + selectedTicketType + ") with expiring event (" + selectedEvent + ") to user (" + selectedUser + ")\n" + e);
            } finally {
                setIsGivingVoucher(false);
            }
            console.log(`giving ${selectedTicketType} to ${selectedUser}`);


        }
    }

    if(loading) {
        return (
            <PageLoading />
        )
    } else if(viewVoucherManagement) {
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
                    {/* Create free ticket container for phone users, hidden for desktop users */}
                    <InnerContainer desktopHide>
                        <DropdownCardContainer>
                            <DropdownCardHeader title={commonText["voucherManagement.giveVoucherTitle"]} dropdownState={giveVoucherDropdownState} onClick={() => setGiveVoucherDropdownState(!giveVoucherDropdownState)} />
                            <DropdownCardContent dropdownState={giveVoucherDropdownState}>
                                {commonText["voucherManagement.giveVoucherDescription"]}
                                
                                <InputContainer column>
                                    <InputLabel small>Billett-type</InputLabel> 
                                    <InputSelect value={selectedTicketType} onChange={updateTicketType}>
                                        <option value={""} label="Ikke valgt" />
                                        {
                                            ticketTypes.map((type) => (<option key={type.uuid} value={type.uuid}>{type.name}</option >))
                                        }
                                    </InputSelect>
                                </InputContainer>

                                <InputContainer column>
                                    <InputLabel small>Siste arrangement for bruk</InputLabel> 
                                    <InputSelect disabled={!events.length} value={selectedEvent} onChange={updateEvent}>
                                        <option value={""} label="Ikke valgt" />
                                        {
                                            events.map((event) => (<option key={event.uuid} value={event.uuid}>{ TimestampToDateTime(event.start_time, "DD_MM_YYYY") + " - " + event.name}</option>))
                                        }
                                    </InputSelect>
                                </InputContainer>

                                <UserSearch onUserSelected={onUserSelected} onChange={() => onUserSelected(null)} />
                                    {
                                        isGivingVoucher ? (
                                            <PageLoading />
                                        ) : (
                                            <PanelButton fillWidth disabled={(!selectedUser || !selectedTicketType || !selectedEvent)} type="submit" onClick={() => giveVoucher()}>Opprett gavekort</PanelButton>
                                        )
                                    }
                            </DropdownCardContent>
                        </DropdownCardContainer>
                    </InnerContainer>

                    {/* Create free ticket container for desktop users, hidden for phone users */}
                    <InnerContainer mobileHide>
                        <InnerContainerRow>
                            <InnerContainerRow>
                                <InnerContainer flex="4" nopadding>
                                    <InnerContainerTitle>{commonText["voucherManagement.giveVoucherTitle"]}</InnerContainerTitle>
                                    <InnerContainerTextBody>
                                        {commonText["voucherManagement.giveVoucherDescription"]}
                                    </InnerContainerTextBody>
                                </InnerContainer>
                                
                                <RowBorder />

                                <InnerContainer flex="2" nopadding>
                                    <CardContainer>
                                        <InputContainer column>
                                            <InputLabel small>Billett-type</InputLabel> 
                                            <InputSelect value={selectedTicketType} onChange={updateTicketType}>
                                                <option value={""} label="Ikke valgt" />
                                                {
                                                    ticketTypes.map((type) => (<option key={type.uuid} value={type.uuid}>{type.name}</option >))
                                                }
                                            </InputSelect>
                                        </InputContainer>
                                    </CardContainer>

                                    <CardContainer>
                                        <InputContainer column>
                                            <InputLabel small>Siste arrangement for bruk</InputLabel> 
                                            <InputSelect disabled={!events.length} value={selectedEvent} onChange={updateEvent}>
                                                <option value={""} label="Ikke valgt" />
                                                {
                                                    events.map((event) => (<option key={event.uuid} value={event.uuid}>{ TimestampToDateTime(event.start_time, "DD_MM_YYYY") + " - " + event.name}</option>))
                                                }
                                            </InputSelect>
                                        </InputContainer>
                                    </CardContainer>
                                    
                                    <CardContainer showOverflow>
                                        <InputContainer column>
                                            <UserSearch onUserSelected={onUserSelected} />
                                        </InputContainer>
                                    </CardContainer>
                                </InnerContainer>

                                <InnerContainer flex="1" nopadding>
                                    {
                                        isGivingVoucher ? (
                                            <PageLoading />
                                        ) : (
                                            <PanelButton fillWidth disabled={(!selectedUser || !selectedTicketType || !selectedEvent)} type="submit" onClick={() => giveVoucher()}>Opprett gavekort</PanelButton>
                                        )
                                    }
                                </InnerContainer>
                            </InnerContainerRow>
                        </InnerContainerRow>
                    </InnerContainer>

                    <InnerContainer>
                        <Table>
                            <TableHead border>
                                <TableRow>
                                    <TableCell as="th" flex="6" mobileHide visible={!visibleUUID}>UUID <SpanLink onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? "(Skjul UUID)" : null}</SpanLink></TableCell>
                                    <TableCell as="th" flex="3" mobileFlex="4">Gavekort eier <SpanLink mobileHide onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? null : "(Vis UUID)"}</SpanLink></TableCell>
                                    <TableCell as="th" flex="2" mobileHide>Billett-type</TableCell>
                                    <TableCell as="th" flex="3" mobileHide>Siste arrangement</TableCell>
                                    <TableCell as="th" flex="2" mobileHide>Opprettet</TableCell>
                                    <TableCell as="th" flex="3" mobileFlex="3">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    vouchers.map((voucher) => {
                                        return (
                                            <TableRow active={voucher.is_expired}>
                                                <TableCell consolas flex="6" mobileHide visible={!visibleUUID}>{ voucher.uuid }</TableCell>
                                                <TableCell flex="3" mobileFlex="4">{ voucher.recipient_user.firstname + " " + voucher.recipient_user.lastname }</TableCell>
                                                <TableCell flex="2" mobileHide>{ voucher.ticket_type.name }</TableCell>
                                                <TableCell flex="3" mobileHide>{ voucher.last_use_event.name } ({ TimestampToDateTime(voucher.last_use_event.start_time, "DD_MM_YYYY")})</TableCell>
                                                <TableCell flex="2" mobileHide>{ TimestampToDateTime(voucher.created, "DD_MM_YYYY_HH_MM_SS") }</TableCell>
                                                <TableCell flex="3" mobileFlex="3">
                                                    { 
                                                        voucher.used 
                                                        ? <span>Brukt {TimestampToDateTime(voucher.used, "DD_MM_YYYY_HH_MM")} - <SpanLink onClick={() => history.push(`/ticket/${voucher.ticket.ticket_id}`)}>#{voucher.ticket.ticket_id}</SpanLink></span> 
                                                        : voucher.is_expired
                                                          ? <span>Utløpt</span>
                                                          : <span>Ikke brukt</span>
                                                    }
                                                </TableCell>
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
    } else {
        return (
            <>
                <DashboardHeader border>
                    <DashboardTitle>
                        Billett-gavekort
                    </DashboardTitle>
                </DashboardHeader>
                <DashboardContent>
                    <InnerContainer rowgap>
                        <InnerContainerRow>
                            <Notice type="error" visible>
                                Du har ikke tilgang til å se eller administrere gavekort for billetter.
                            </Notice>
                        </InnerContainerRow>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
import { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { TicketType, getCurrentEvent, getEventTickets, Ticket, User } from "@phoenixlan/phoenix.js";
import { CardContainer, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, DropdownCardContainer, DropdownCardContent, DropdownCardHeader, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputLabel, InputSelect, PanelButton, RowBorder } from "../../components/dashboard";
import { UserSearch } from '../../components/userSearch';
import { Table, TableCell, TableHead, IconContainer, SelectableTableRow, TableRow, TableBody } from "../../components/table";
import { PageLoading } from "../../components/pageLoading";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Notice } from "../../components/containers/notice";
import { TimestampToDateTime } from "../../components/timestampToDateTime";
import { AuthenticationContext } from "../../components/authentication";

const commonText = {
    "freeTicket.giveTicketTitle": "Opprett gratis- eller avtalebillett",
    "freeTicket.giveTicketDescription": ["Her kan du gi ut gratis- eller avtalebilletter til enkeltpersoner eller større grupper som f.eks. har vunnet konkurranser, eller har en egen avtale med arrangøren hvor pris for billettene er ordnet utenfor dette systemet.", <br />, "Merk at gratisbilletter er ingen spøk og kan være tapte penger for arrangementet."]
}


export const FreeTicketManagement = () => {

    let history = useHistory();

    // Import the following React contexts:
    const authContext = useContext(AuthenticationContext);

    // Function availibility control:
    let viewFreeTicketManagement = false;

    const [ ticketTypes, setTicketTypes ] = useState([]);
    const [ tickets, setTickets ] = useState([]);
    const [ allTickets, setAllTickets ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ selectedUser, setSelectedUser ] = useState("");
    const [ selectedTicketType, setSelectedTicketType ] = useState(undefined);

    const [ isGivingFreeTicket, setIsGivingFreeTicket] = useState(false);
    const [ giveFreeTicketDropdownState, setGiveFreeTicketDropdownState ] = useState(false);

    const [ currentEvent, setCurrentEvent ] = useState();

    // Check if user has "admin" role and make the following functions available:
    if (authContext.roles.includes("admin") || authContext.roles.includes("ticket_admin")) {
        viewFreeTicketManagement = true;
    }

    const load = async () => {
        if(viewFreeTicketManagement) {
            const [ currentEvent, types ] = await Promise.all([
                getCurrentEvent(),
                TicketType.getTicketTypes()
            ])

            if(currentEvent) {
                setCurrentEvent(currentEvent);

                const tickets = await getEventTickets(currentEvent.uuid);

                const validTypes = types.filter(type => type.price === 0);
                setTicketTypes(validTypes);

                // TODO filter
                const validTypeUuids = validTypes.map(type => type.uuid);
                setAllTickets(tickets);
                setTickets(tickets.filter(ticket => validTypeUuids.indexOf(ticket.ticket_type.uuid) !== -1));
            }
        }

        setLoading(false);
    }

    useEffect(async () => {
        await load();
    }, [])

    const onUserSelected = (uuid) => {
        setSelectedUser(uuid);
    }

    const updateTicketType = (currentEvent) => {
        setSelectedTicketType(currentEvent.target.value);
    }

    const giveTicket = async () => {
        if(currentEvent) {
            if(!selectedUser) {
                alert("No user is selected");
            } else {
                try {
                    setIsGivingFreeTicket(true);
                    await Ticket.createTicket(selectedUser, selectedTicketType);
                    await load();
                } catch(e) {
                    alert("An error occured when giving free ticket to this user.\n\n" + e)
                    console.error("An error occured when creating a new ticket (" + selectedTicketType + ") to user (" + selectedUser + ")\n" + e)
                } finally {
                    setIsGivingFreeTicket(false);
                }
            }
        }
        //await setLoading(true);
    }

    if(loading) {
        return (
            <PageLoading />
        )
    } else if(viewFreeTicketManagement) {
        return (
            <>
                <DashboardHeader border>
                    <DashboardTitle>
                        Gratisbilletter
                    </DashboardTitle>
                    {   
                        // Check: If there exists a tickettype which is free or not
                        ticketTypes.length === 0 ?
                            null
                        :
                            // Check: If there exists any free tickets during the current event
                            tickets.length === 0 ?
                                <DashboardSubtitle>
                                    Det er for øyeblikket ingen gratisbilletter i sirkulasjon
                                </DashboardSubtitle>
                            :
                                <DashboardSubtitle>
                                    {allTickets.length} billetter registrert for dette arrangementet hvorav {tickets.length} er gratisbilletter
                                </DashboardSubtitle>
                        //:
                    } 

                </DashboardHeader>

                <DashboardContent>

                    
                    <InnerContainer visible={!currentEvent}>
                        <InnerContainerRow>
                            <Notice fillWidth type="warning" visible={!currentEvent}>
                                Det eksisterer for øyeblikket ingen aktive arrangementer.<br/>
                                Det er derfor ikke mulig å opprette gratis- eller avtalebilletter.<br/>
                                Opprett et nytt arrangement for å kunne opprette gratis- eller avtalebilletter.
                            </Notice>
                        </InnerContainerRow>
                    </InnerContainer>

                    {/* Create free ticket container for phone users, hidden for desktop users */}
                    <InnerContainer desktopHide>
                        <DropdownCardContainer>
                            <DropdownCardHeader title={commonText["freeTicket.giveTicketTitle"]} dropdownState={giveFreeTicketDropdownState} onClick={() => setGiveFreeTicketDropdownState(!giveFreeTicketDropdownState)} />
                            <DropdownCardContent dropdownState={giveFreeTicketDropdownState}>
                                {commonText["freeTicket.giveTicketDescription"]}
                                
                                <InputContainer column>
                                    <InputLabel small>Billett-type</InputLabel>
                                    <InputSelect disabled={!currentEvent} value={selectedTicketType} onChange={updateTicketType}>
                                        <option value={""} label="Ikke valgt" />
                                        {
                                            ticketTypes.map((type) => (<option key={type.uuid} value={type.uuid}>{type.name}</option >))
                                        }
                                    </InputSelect>
                                </InputContainer>

                                <UserSearch disabled={!currentEvent} onUserSelected={onUserSelected} onChange={() => onUserSelected(null)} />
                                {
                                    isGivingFreeTicket ? (
                                        <PageLoading />
                                    ) : (
                                        <PanelButton fillWidth disabled={(!selectedUser || !selectedTicketType)} type="submit" onClick={() => giveTicket()}>Opprett billett</PanelButton>
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
                                    <InnerContainerTitle>{commonText["freeTicket.giveTicketTitle"]}</InnerContainerTitle>
                                    {commonText["freeTicket.giveTicketDescription"]}
                                </InnerContainer>
                                <RowBorder />
                                <InnerContainer flex="2" nopadding>
                                    <CardContainer>
                                        <InputContainer column>
                                            <InputLabel small>Billett-type</InputLabel>
                                            <InputSelect disabled={!currentEvent} value={selectedTicketType} onChange={updateTicketType}>
                                                <option value={""} label="Ikke valgt" />
                                                {
                                                    ticketTypes.map((type) => (<option key={type.uuid} value={type.uuid}>{type.name}</option >))
                                                }
                                            </InputSelect>
                                        </InputContainer>
                                    </CardContainer>
                                    
                                    <CardContainer showOverflow>
                                        <InputContainer column>
                                            <UserSearch disabled={!currentEvent} onUserSelected={onUserSelected} />
                                        </InputContainer>
                                    </CardContainer>
                                </InnerContainer>
                                <InnerContainer flex="1" nopadding>
                                    {
                                        isGivingFreeTicket ? (
                                            <PageLoading />
                                        ) : (
                                            <PanelButton fillWidth disabled={(!selectedUser || !selectedTicketType)} type="submit" onClick={() => giveTicket()}>Opprett billett</PanelButton>
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
                                    <TableCell as="th" flex="1" mobileFlex="2">ID</TableCell>
                                    <TableCell as="th" flex="2" mobileFlex="3">Billett type</TableCell>
                                    <TableCell as="th" flex="4" mobileFlex="7">Nåværende eier</TableCell>
                                    <TableCell as="th" flex="4" mobileHide>Opprinnelig eier</TableCell>
                                    <TableCell as="th" flex="4" mobileHide>Seates av bruker</TableCell>
                                    <TableCell as="th" flex="2" mobileFlex="2">Sete</TableCell>
                                    <TableCell as="th" flex="3" mobileHide>Utsendelsestid</TableCell>
                                    <TableCell as="th" center flex="0 24px" mobileHide title="Trykk for å åpne"><IconContainer>...</IconContainer></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    tickets.map((ticket) => {
                                        return (
                                            <SelectableTableRow title="Trykk for å åpne" onClick={e => {history.push(`/ticket/${ticket.ticket_id}`)}}>
                                                <TableCell consolas flex="1" mobileFlex="2">#{ ticket.ticket_id }</TableCell>
                                                <TableCell flex="2" mobileFlex="3">{ ticket.ticket_type.name }</TableCell>
                                                <TableCell flex="4" mobileFlex="7">{ User.getFullName(ticket.owner) }</TableCell>
                                                <TableCell flex="4" mobileHide>{ User.getFullName(ticket.buyer) }</TableCell>
                                                <TableCell flex="4" mobileHide>{ User.getFullName(ticket.seater) }</TableCell>
                                                <TableCell flex="2" mobileFlex="2">{ ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "" }</TableCell>
                                                <TableCell flex="3" mobileHide><TimestampToDateTime timestamp={ticket.created} type="DD_MM_YYYY_HH_MM" /></TableCell>
                                                <TableCell flex="0 24px" mobileHide center><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
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
    } else {
        return (
            <>
                <DashboardHeader border>
                    <DashboardTitle>
                        Gratisbilletter
                    </DashboardTitle>
                </DashboardHeader>
                <DashboardContent>
                    <InnerContainer rowgap>
                        <InnerContainerRow>
                            <Notice type="error" visible>
                                Du har ikke tilgang til å se eller administrere gratisbilletter.
                            </Notice>
                        </InnerContainerRow>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
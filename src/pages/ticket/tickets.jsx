import { useState, useEffect, useContext } from "react"
import { useHistory } from 'react-router-dom';
import { getActiveStoreSessions, getEventTickets, getCurrentEvent, User, TicketType } from "@phoenixlan/phoenix.js";
import { Table, TableCell, TableHead, IconContainer, SelectableTableRow, TableRow, TableBody } from "../../components/table";
import { PageLoading } from "../../components/pageLoading";
import { CardContainer, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputElement, InputLabel, InputSelect, RowBorder } from "../../components/dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCheck, faMinus } from "@fortawesome/free-solid-svg-icons";
import { BarElement, FlexBar } from "../../components/bar";
import { AuthenticationContext } from "../../components/authentication";
import { Notice } from "../../components/containers/notice";

const SORTING_METHODS = {
    TICKET_ID: 1,
    TICKET_TYPE: 2,
    TICKET_OWNER: 3,
    TICKED_CHECKED_IN: 4
}

const SORTING_TYPES = {}
SORTING_TYPES[SORTING_METHODS.TICKET_ID] = (a, b) => a.ticket_id - b.ticket_id;
SORTING_TYPES[SORTING_METHODS.TICKET_TYPE] = (a, b) => a.ticket_type.name.localeCompare(b.ticket_type.name);
SORTING_TYPES[SORTING_METHODS.TICKET_OWNER] = (a, b) => a.owner.firstname.localeCompare(b.owner.firstname);
SORTING_TYPES[SORTING_METHODS.TICKED_CHECKED_IN] = (a, b) => b.checked_in - a.checked_in;

export const TicketList = () => {

    let history = useHistory();

    // Import the following React contexts:
    const authContext = useContext(AuthenticationContext);

    // Function availibility control:
    let viewTickets = false;

    const [ tickets, setTickets ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const [ activeSortingMethod, setActiveSortingMethod] = useState(1);
    const [ search, setSearch ] = useState("");

    const [ ticketsProgressBar, setTicketsProgressBar ] = useState(undefined);
    const [ checkedinTicketsProgressBar, setCheckedinTicketsProgressBar] = useState(undefined);

    const [ currentEvent, setCurrentEvent ] = useState();

    // Check if user has "admin" or "ticket_admin" role and make the following functions available:
    if (authContext.roles.includes("admin") || authContext.roles.includes("ticket_admin")) {
        viewTickets = true;
    }

    const reload = async () => {
        if(viewTickets) {
            const currentEvent = await getCurrentEvent();

            if(currentEvent) {
                const [ tickets, storeSessions, allTicketTypes ] = await Promise.all([
                    getEventTickets(currentEvent.uuid),
                    getActiveStoreSessions(),
                    TicketType.getTicketTypes()
                ])

                // Count all tickets which is held in store sessions
                let heldTickets = 0; 
                storeSessions.map((storeSession) => {
                    storeSession.entries.map((entry) => {
                        if(entry.ticket_type.seatable) {
                            heldTickets += entry.amount;
                        }  
                    })
                })

                // Logic to create progressbars for tickets and checked in tickets
                let ticketsProgressBar = [];
                let checkedinTicketsProgressBar = [];

                let availableTickets = currentEvent.max_participants - tickets.filter((ticket) => ticket.ticket_type.seatable == true).length - heldTickets; 

                let ticketsCheckedinCount = 0;
                let ticketsNotCheckedinCount = 0;

                // Go through all tickets, filter out non-seatable tickets, sort after price, count tickets for each type and if they are checked in or not.
                // Logic for creating the tickets progressbar
                allTicketTypes
                    .filter((ticketType) => ticketType.seatable == true)
                    .sort((a, b) => a.price < b.price)
                    .map((ticketType) => {
                        let countedTicketsForTicketType = 0;
            
                        tickets
                        .filter((ticket) => ticket.ticket_type.uuid == ticketType.uuid && ticket.ticket_type.seatable == true)
                        .map((ticket) => {
                            countedTicketsForTicketType++;
                            ticket.checked_in ? ticketsCheckedinCount++ : ticketsNotCheckedinCount++;
                        })
            
                        ticketsProgressBar.push({
                            key: ticketType.uuid,
                            color: ticketType.price ? "green" : "stripedGreen",
                            title: ticketType.name,
                            count: countedTicketsForTicketType
                        })
                    })
                ticketsProgressBar.push({
                    key: "availableTickets",
                    color: "gray",
                    title: "Tilgjengelige billetter",
                    count: availableTickets
                })
                ticketsProgressBar.push({
                    key: "reservedTickets",
                    color: "stripedOrange",
                    title: "Billetter reservert i kjøp",
                    count: heldTickets
                })
                setTicketsProgressBar(ticketsProgressBar);

                // Logic for creating the checkedintickets progressbar
                checkedinTicketsProgressBar.push({
                    key: "ceckedinTickets",
                    color: "green",
                    title: "Billetter sjekket inn",
                    count: ticketsCheckedinCount
                })
                checkedinTicketsProgressBar.push({
                    key: "notCheckedinTickets",
                    color: "gray",
                    title: "Billetter ikke sjekket inn",
                    count: ticketsNotCheckedinCount,
                    fillOnEmpty: !ticketsCheckedinCount
                })
                setCheckedinTicketsProgressBar(checkedinTicketsProgressBar);

                setCurrentEvent(currentEvent)
                setTickets(tickets);
            } else {
                setTicketsProgressBar([]);
                setCheckedinTicketsProgressBar([])
            }
        }

        setLoading(false);
    }

    useEffect(() => {
        reload();
    }, []);

    if(loading) {
        return (
            <PageLoading />
        )
    }

    // Ticket sorting and filtering
    let processedTicketList = tickets
    .filter((ticket) => 
        ticket.owner.firstname.toLowerCase().includes(search) || 
        ticket.owner.lastname.toLowerCase().includes(search) ||
        ticket.owner.username.toLowerCase().includes(search) ||
        ticket.ticket_id == search
    )
    .sort(SORTING_TYPES[activeSortingMethod]);

    if(viewTickets) {
        return (
            <>
                <DashboardHeader border>
                    <DashboardTitle>
                        Billetter
                    </DashboardTitle>
                    <DashboardSubtitle>
                        { search 
                            ? "Viser " + processedTicketList.length + " av " + tickets.length + " salg for dette arrangementet"
                            : tickets.length + " salg for dette arrangementet"
                        }
                    </DashboardSubtitle>
                </DashboardHeader>
                <DashboardContent>
                    <InnerContainer visible={!currentEvent}>
                        <InnerContainerRow>
                            <Notice fillWidth type="warning" visible={!currentEvent}>
                                Det eksisterer for øyeblikket ingen aktive arrangementer.<br/>
                            </Notice>
                        </InnerContainerRow>
                    </InnerContainer>

                    <InnerContainer rowgap>
                        <InnerContainerRow>
                            <InnerContainer flex="1" floattop>
                                <InnerContainer>
                                    <InnerContainerTitle>Filtrering og sortering</InnerContainerTitle>
                                    <InnerContainer>
                                        <CardContainer>
                                            <InputContainer column extramargin>
                                                <InputLabel small>Søk</InputLabel>
                                                <InputElement disabled={!tickets.length} type="text" placeholder="Billet ID, for- etternavn, brukernavn ..." onChange={(e) => setSearch(e.target.value.toLowerCase())}></InputElement>
                                            </InputContainer>
                                        </CardContainer>
                                    </InnerContainer>

                                    <InnerContainer>
                                        <CardContainer>
                                            <InputContainer column extramargin>
                                                <InputLabel small>Billettsortering</InputLabel>
                                                <InputSelect disabled={!tickets.length} onChange={(e) => setActiveSortingMethod(e.target.value)}>
                                                    <option value={SORTING_METHODS.TICKET_ID}>Billett ID</option>
                                                    <option value={SORTING_METHODS.TICKET_TYPE}>Billett type</option>
                                                    <option value={SORTING_METHODS.TICKET_OWNER}>Billett eier</option>
                                                    <option value={SORTING_METHODS.TICKED_CHECKED_IN}>Innsjekket</option>
                                                </InputSelect>
                                            </InputContainer>
                                        </CardContainer>
                                    </InnerContainer>
                                </InnerContainer>
                            </InnerContainer>

                            <InnerContainer flex="1" floattop>
                                <InnerContainer>
                                    <InnerContainerTitle>Billettfordeling</InnerContainerTitle>
                                    <InnerContainer column extramargin>
                                        <FlexBar>
                                            {ticketsProgressBar.map((object) => {
                                                return (<BarElement color={object.color} title={object.title} count={object.count} key={object.key} />)
                                            })}
                                        </FlexBar>
                                    </InnerContainer>
                                </InnerContainer>
                            </InnerContainer>
                            
                            <InnerContainer flex="1" floattop>
                                <InnerContainer>
                                    <InnerContainerTitle>Innsjekkede billetter</InnerContainerTitle>
                                    <InnerContainerRow>
                                        <FlexBar>
                                            {checkedinTicketsProgressBar.map((object) => {
                                                return (<BarElement color={object.color} title={object.title} count={object.count} fillOnEmpty={object.fillOnEmpty} key={object.key} />)
                                            })}
                                        </FlexBar>
                                    </InnerContainerRow>
                                </InnerContainer>
                            </InnerContainer>
                        </InnerContainerRow>
                    </InnerContainer>
                    

                    <InnerContainer>
                        <Table>
                            <TableHead border>
                                <TableRow>
                                    <TableCell as="th" flex="1" mobileFlex="2">ID</TableCell>
                                    <TableCell as="th" flex="2" mobileHide>Billett type</TableCell>
                                    <TableCell as="th" flex="4" mobileFlex="7">Eies av bruker</TableCell>
                                    <TableCell as="th" flex="4" mobileHide>Kjøpt av bruker</TableCell>
                                    <TableCell as="th" flex="4" mobileHide>Seates av bruker</TableCell>
                                    <TableCell as="th" flex="2" mobileFlex="2">Sete</TableCell>
                                    <TableCell as="th" flex="3" mobileHide>Kjøpetid</TableCell>
                                    
                                    <TableCell as="th" center flex="0 24px" title="Statusikon: Ikon vises dersom billetten har blitt sjekket inn"><IconContainer>...</IconContainer></TableCell>
                                    <TableCell as="th" center flex="0 24px" title="Trykk for å åpne"><IconContainer>...</IconContainer></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    processedTicketList.map((ticket) => {
                                        return (
                                            <SelectableTableRow title="Trykk for å åpne" onClick={e => {history.push(`/ticket/${ticket.ticket_id}`)}} key={ticket.ticket_id}>
                                                <TableCell consolas flex="1" mobileFlex="2">#{ ticket.ticket_id }</TableCell>
                                                <TableCell flex="2" mobileHide>{ ticket.ticket_type.name }</TableCell>
                                                <TableCell flex="4" mobileFlex="7">{ User.getFullName(ticket.owner) }</TableCell>
                                                <TableCell flex="4" mobileHide>{ User.getFullName(ticket.buyer) }</TableCell>
                                                <TableCell flex="4" mobileHide>{ User.getFullName(ticket.seater) }</TableCell>
                                                <TableCell flex="2" mobileFlex="2">{ ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "" }</TableCell>
                                                <TableCell flex="3" mobileHide>{ new Date(ticket.created*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) }</TableCell>
                                                <TableCell flex="0 24px" center>
                                                    {/* Temporary logic until API has checkinable columns in ticket_types - Show a minus if a ticket is not checkinable based on logic !seatable and grants_membership, currently only membership tickets */}
                                                    {(!ticket.ticket_type.seatable && ticket.ticket_type.grants_membership) ? <IconContainer color="#616161"><FontAwesomeIcon icon={faMinus} title="Billetten er medlemsskap, og kan ikke sjekkes inn" /></IconContainer> : null}
                                                    {(ticket.checked_in) ? <IconContainer color="#388e3c"><FontAwesomeIcon icon={faCheck} title="Billetten er sjekket inn" /></IconContainer> : null}
                                                </TableCell>
                                                <TableCell flex="0 24px" center><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
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
                        Billetter
                    </DashboardTitle>
                </DashboardHeader>
                <DashboardContent>
                    <InnerContainer rowgap>
                        <InnerContainerRow>
                            <Notice type="error" visible>
                                Du har ikke tilgang til å se billetter.
                            </Notice>
                        </InnerContainerRow>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
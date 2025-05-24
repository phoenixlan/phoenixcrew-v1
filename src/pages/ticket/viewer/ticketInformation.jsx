import { useContext, useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { captureException } from "@sentry/browser";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar as faStarRegular, faAddressCard, faCalendar, faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faCode, faGear, faLink, faLocationDot, faUserGroup, faUserTie } from "@fortawesome/free-solid-svg-icons"

import { SelectableTableRow, Table, TableBody, TableCell, TableHead, TableRow } from "../../../components/table";
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInnerText, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InputLabel, PanelButton, SpanLink } from "../../../components/dashboard"
import { AuthenticationContext } from "../../../components/authentication";
import { PageLoading } from "../../../components/pageLoading";
import { Ticket } from "@phoenixlan/phoenix.js";




export const TicketInformation = ({data}) => {

    const history = useHistory();

    // Import the following React contexts:
    const authContext = useContext(AuthenticationContext);
    
    // Function availibility control:
    let checkinStateButtonAvailibility = false;

    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    // Function to check in ticket
    const checkinTicket = async () => {
        if(window.confirm("Er du sikker på at du vil sjekke inn denne billetten?")) {
            try {
                await Ticket.checkInTicket(data.ticket.ticket_id);
                window.location.reload();
            } catch(e) {
                setError(e);
                captureException(e);
                console.error("An error occured while attempting to checkin ticket\n" + e);
            } 
        }
    }

    // Check if user has "admin" role and make the following functions available:
    if (authContext.roles.includes("admin") || authContext.roles.includes("ticket_admin") || authContext.roles.includes("ticket_checkin")) {
        checkinStateButtonAvailibility = true;
    }

    useEffect(async () => {
        setLoading(false);
    }, [])

    if(loading) {
        return (<PageLoading />)
    }
    return (
        <>
                    <InnerContainer rowgap>
                        <InnerContainerRow>
                            <PanelButton onClick={checkinStateButtonAvailibility ? () => checkinTicket() : null} disabled={(data.ticket.checked_in || !checkinStateButtonAvailibility)} icon={faCheck}>{data.ticket.checked_in === null ? "Sjekk inn billett" : "Billett sjekket inn"}</PanelButton>
                        </InnerContainerRow>
                    </InnerContainer>

                    <InnerContainer>
                        <InnerContainerRow>
                            <InnerContainer flex="1" floattop>
                                <InnerContainerTitle>Generelt</InnerContainerTitle>
                                <CardContainer>
                                    <CardContainerIcon>
                                        <CardContainerInnerIcon>
                                            <FontAwesomeIcon icon={faCode} />
                                        </CardContainerInnerIcon>
                                    </CardContainerIcon>
                                    <CardContainerText>
                                    <InputLabel small>Billett-ID</InputLabel>
                                        <CardContainerInnerText console>{data.ticket.ticket_id}</CardContainerInnerText>
                                    </CardContainerText>
                                </CardContainer>

                                <CardContainer>
                                    <CardContainerIcon />
                                    <CardContainerText>
                                    <InputLabel small>Billett type</InputLabel>
                                        <CardContainerInnerText>{data.ticket.ticket_type.name}</CardContainerInnerText>
                                    </CardContainerText>
                                </CardContainer>

                                <CardContainer>
                                    <CardContainerIcon>
                                        <CardContainerInnerIcon>
                                            <FontAwesomeIcon icon={faCalendar} />
                                        </CardContainerInnerIcon>
                                    </CardContainerIcon>
                                    <CardContainerText>
                                    <InputLabel small>Arrangement</InputLabel>
                                        <CardContainerInnerText><SpanLink onClick={() => history.push(`/event/${data.ticket.event.uuid}`)}>{data.ticket.event.name}</SpanLink></CardContainerInnerText>
                                    </CardContainerText>
                                </CardContainer>

                                <CardContainer>
                                    <CardContainerIcon>
                                        <CardContainerInnerIcon>
                                            <FontAwesomeIcon icon={faLocationDot} />
                                        </CardContainerInnerIcon>
                                    </CardContainerIcon>
                                    <CardContainerText disabled={!data.ticket.ticket_type.seatable}>
                                    <InputLabel small>Setereservasjon</InputLabel>
                                        <CardContainerInnerText>{data.ticket.ticket_type.seatable ? data.ticket.seat ? ("R" + data.ticket.seat.row.row_number + " S" + data.ticket.seat.number) : "Billetten er ikke seatet" : "Billetten kan ikke seates"}</CardContainerInnerText>
                                    </CardContainerText>
                                </CardContainer>
                            </InnerContainer>

                            <InnerContainer flex="1" floattop rowgap nopadding>
                                <InnerContainer>
                                    <InnerContainerTitle>Relaterte personer</InnerContainerTitle>
                                    <CardContainer>
                                        <CardContainerIcon>
                                            <CardContainerInnerIcon>
                                                <FontAwesomeIcon icon={faUser} />
                                            </CardContainerInnerIcon>
                                        </CardContainerIcon>
                                        <CardContainerText>
                                        <InputLabel small>Eier</InputLabel>
                                            <CardContainerInnerText><SpanLink onClick={() => history.push(`/user/${data.ticket.owner.uuid}`)}>{data.ticket.owner.firstname}, {data.ticket.owner.lastname}</SpanLink></CardContainerInnerText>
                                        </CardContainerText>
                                    </CardContainer>
                                    
                                    <CardContainer>
                                        <CardContainerIcon>
                                            <CardContainerInnerIcon>
                                                <FontAwesomeIcon icon={faUser} />
                                            </CardContainerInnerIcon>
                                        </CardContainerIcon>
                                        <CardContainerText>
                                        <InputLabel small>Kjøper</InputLabel>
                                            <CardContainerInnerText><SpanLink onClick={() => history.push(`/user/${data.ticket.buyer.uuid}`)}>{data.ticket.buyer.firstname}, {data.ticket.buyer.lastname}</SpanLink></CardContainerInnerText>
                                        </CardContainerText>
                                    </CardContainer>
                                    
                                    <CardContainer>
                                        <CardContainerIcon>
                                            <CardContainerInnerIcon>
                                                <FontAwesomeIcon icon={faUser} />
                                            </CardContainerInnerIcon>
                                        </CardContainerIcon>
                                        <CardContainerText>
                                        <InputLabel small>Seater</InputLabel>
                                            <CardContainerInnerText><SpanLink onClick={() => history.push(`/user/${data.ticket.seater.uuid}`)}>{data.ticket.seater.firstname}, {data.ticket.seater.lastname}</SpanLink></CardContainerInnerText>
                                        </CardContainerText>
                                    </CardContainer>
                                </InnerContainer>

                                <InnerContainer>
                                <InnerContainerTitle>Status</InnerContainerTitle>
                                    <CardContainer>
                                        <CardContainerIcon>
                                            <CardContainerInnerIcon>
                                                <FontAwesomeIcon icon={data.currentEvent.uuid === data.ticket.event.uuid ? faCheck : null}  />
                                            </CardContainerInnerIcon>
                                        </CardContainerIcon>
                                        <CardContainerText>
                                        <InputLabel small>Aktiv for kommende arrangement</InputLabel>
                                            <CardContainerInnerText>{data.currentEvent.uuid === data.ticket.event.uuid ? "Ja" : "Nei, ikke nåværende arrangement"}</CardContainerInnerText>
                                        </CardContainerText>
                                    </CardContainer>
                                    <CardContainer>
                                        <CardContainerIcon>
                                            <CardContainerInnerIcon>
                                                <FontAwesomeIcon icon={data.ticket.checked_in ? faCheck : null} />
                                            </CardContainerInnerIcon>
                                        </CardContainerIcon>
                                        <CardContainerText>
                                        <InputLabel small>Sjekket inn</InputLabel>
                                            <CardContainerInnerText>{data.ticket.checked_in ? "Ja" : "Nei"}</CardContainerInnerText>
                                        </CardContainerText>
                                    </CardContainer>
                                </InnerContainer>
                            </InnerContainer>
                        </InnerContainerRow>
                    </InnerContainer>
                    <InnerContainer>
                        <InnerContainerTitle>Hendelseslogg</InnerContainerTitle>
                        <InnerContainer>
                            <Table>
                                <TableHead border>
                                    <TableRow>
                                        <TableCell flex="1">Tidspunkt</TableCell>
                                        <TableCell flex="5">Hendelse</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <SelectableTableRow>
                                        <TableCell flex="1">24.05.2025 18:10</TableCell>
                                        <TableCell flex="5">Billett kjøpt</TableCell>
                                    </SelectableTableRow>
                                </TableBody>
                            </Table>
                        </InnerContainer>
                    </InnerContainer>
        </>
    )
}
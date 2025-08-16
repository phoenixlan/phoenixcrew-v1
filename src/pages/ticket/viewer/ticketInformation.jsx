import { useContext, useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { captureException } from "@sentry/browser";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar as faStarRegular, faAddressCard, faCalendar, faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faCode, faDollarSign, faGear, faLink, faLocationDot, faUserGroup, faUserTie } from "@fortawesome/free-solid-svg-icons"

import { SelectableTableRow, Table, TableBody, TableCell, TableHead, TableRow } from "../../../components/table";
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInnerText, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InnerTextSuffixWarning, InputLabel, PanelButton, SpanLink } from "../../../components/dashboard"
import { AuthenticationContext } from "../../../components/authentication";
import { PageLoading } from "../../../components/pageLoading";
import { useParams } from "react-router-dom";
import { Ticket } from "@phoenixlan/phoenix.js";
import { Notice } from "../../../components/containers/notice";
import { TimestampToDateTime } from "../../../components/timestampToDateTime";




export const TicketInformation = ({data}) => {

    const history = useHistory();
    const { id } = useParams();

    // Import the following React contexts:
    const authContext = useContext(AuthenticationContext);
    
    // Function availibility control:
    let checkinStateButtonAvailibility = false;

    // Ticket for event is current event check
    let ticketForCurrentEvent = data.currentEvent.uuid === data.ticket.event.uuid;

    const [ ticketEventLog, setTicketEventLog ] = useState([]);

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

    const createEventlog = async () => {
        let ticketEventLog = [];

        // Create log entry when ticket was created
        if(data.ticket.payment_uuid) {
            ticketEventLog.push({timestamp: data.ticket.created, message: "Billett opprettet med vellykket kjøpt"})
        } else {
            ticketEventLog.push({timestamp: data.ticket.created, message: "Billett opprettet"})
        }
        
        // Create log entry when ticket was checked in
        if(data.ticket.checked_in) {
            ticketEventLog.push({timestamp: data.ticket.checked_in, message: "Billett sjekket inn"})
        }

        // Create log entries when ticket has been transferred
        try {
            let ticketTransferLog = await Ticket.getTransferLog(id);
            ticketTransferLog.map((data) => {
                ticketEventLog.push({timestamp: data.created, message: "Billett overført fra " + data.from_user.firstname + " " + data.from_user.lastname + " til " + data.to_user.firstname + " " + data.to_user.lastname + " " + (data.reverted ? "– Overførselen ble angret" : "")})
            })
        } catch(e) {
            console.error(e)
        }

        // Sort all log entries by their timestamps
        ticketEventLog.sort((a, b) => a.timestamp < b.timestamp)

        setTicketEventLog(ticketEventLog);
    }

    // Check if user has "admin" role and make the following functions available:
    if (authContext.roles.includes("admin") || authContext.roles.includes("ticket_admin") || authContext.roles.includes("ticket_checkin")) {
        checkinStateButtonAvailibility = true;
    }

    useEffect(async () => {
        createEventlog();
        setLoading(false);
    }, [])

    console.log();

    if(loading) {
        return (<PageLoading />)
    }
    return (
        <>
                    <InnerContainer rowgap>
                        {
                            !ticketForCurrentEvent && 
                            <InnerContainerRow>
                                <Notice fillWidth type="info" visible>
                                    OBS! Du ser på en billett for et annet arrangement
                                </Notice>
                            </InnerContainerRow>
                        }
                        
                        <InnerContainerRow>
                            <PanelButton onClick={checkinStateButtonAvailibility ? () => checkinTicket() : null} disabled={(data.ticket.checked_in || !checkinStateButtonAvailibility)} icon={faCheck}>{data.ticket.checked_in === null ? "Sjekk inn billett" : "Billett sjekket inn"}</PanelButton>
                        </InnerContainerRow>
                    </InnerContainer>

                    <InnerContainer>
                        <InnerContainerRow rowgap>
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
                                            <FontAwesomeIcon icon={faDollarSign} />
                                        </CardContainerInnerIcon>
                                    </CardContainerIcon>
                                    <CardContainerText>
                                    <InputLabel small>Pris</InputLabel>
                                        <CardContainerInnerText>{data.ticket.ticket_type.price} kr</CardContainerInnerText>
                                    </CardContainerText>
                                </CardContainer>

                                <CardContainer>
                                    <CardContainerIcon>
                                        <CardContainerInnerIcon>
                                            <FontAwesomeIcon icon={faCalendar} />
                                        </CardContainerInnerIcon>
                                    </CardContainerIcon>
                                    <CardContainerText>
                                    <InputLabel small>Gjelder for arrangement</InputLabel>
                                        <CardContainerInnerText italic={!ticketForCurrentEvent}><SpanLink onClick={() => history.push(`/event/${data.ticket.event.uuid}`)}>{data.ticket.event.name}</SpanLink></CardContainerInnerText>
                                    </CardContainerText>
                                </CardContainer>

                                <CardContainer disabled={!data.ticket.ticket_type.seatable}>
                                    <CardContainerIcon>
                                        <CardContainerInnerIcon>
                                            <FontAwesomeIcon icon={faLocationDot} />
                                        </CardContainerInnerIcon>
                                    </CardContainerIcon>
                                    <CardContainerText>
                                    <InputLabel small>Setereservasjon</InputLabel>
                                        <CardContainerInnerText>{data.ticket.ticket_type.seatable ? data.ticket.seat ? ("R" + data.ticket.seat.row.row_number + " S" + data.ticket.seat.number) : "Billetten er ikke seatet" : "Billetten kan ikke seates"}</CardContainerInnerText>
                                    </CardContainerText>
                                </CardContainer>
                            </InnerContainer>

                            <InnerContainer flex="1" floattop rowgap nopadding>
                                <InnerContainer>
                                    <InnerContainerTitle>Eier, kjøper, og seater</InnerContainerTitle>
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
                                    {
                                        ticketEventLog.map((entry) => {
                                            return (
                                                <SelectableTableRow>
                                                    <TableCell flex="1"><TimestampToDateTime timestamp={entry.timestamp} type="DD_MM_YYYY_HH_MM_SS" /></TableCell>
                                                    <TableCell flex="5">{entry.message}</TableCell>
                                                </SelectableTableRow>
                                            )
                                        })
                                    }
                                    
                                </TableBody>
                            </Table>
                        </InnerContainer>
                    </InnerContainer>
        </>
    )
}
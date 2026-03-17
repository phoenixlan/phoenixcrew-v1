import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { captureException } from "@sentry/browser";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar, faUser } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faCode, faDollarSign, faLocationDot } from "@fortawesome/free-solid-svg-icons"

import { SelectableTableRow, Table, TableBody, TableCell, TableHead, TableRow } from "../../../components/table";
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInnerText, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InputLabel, PanelButton, SpanLink } from "../../../components/dashboard"
import { AuthenticationContext } from "../../../components/authentication";
import { PageLoading } from "../../../components/pageLoading";
import { useParams } from "react-router-dom";
import { Ticket } from "@phoenixlan/phoenix.js";
import { Notice } from "../../../components/containers/notice";
import { TimestampToDateTime } from "../../../components/timestampToDateTime";

import { useTicketCheckinMutation } from "../../../hooks/useTicketCheckinMutation";


export const TicketInformation = ({data}) => {

    const history = useHistory();
    const { id } = useParams();

    const authContext = useContext(AuthenticationContext);

    const checkinMutation = useTicketCheckinMutation();

    // Ticket for event is current event check
    let ticketForCurrentEvent = data.currentEvent.uuid === data.ticket.event.uuid;

    // Check if user has appropriate role and ticket grants admission
    let checkinStateButtonAvailibility = false;
    if (authContext.roles.includes("admin") || authContext.roles.includes("ticket_admin") || authContext.roles.includes("ticket_checkin")) {
        if(data.ticket.ticket_type.grants_admission) {
            checkinStateButtonAvailibility = true;
        }
    }

    const [ ticketEventLog, setTicketEventLog ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const createEventlog = async () => {
            const log = [];

            if(data.ticket.payment_uuid) {
                log.push({timestamp: data.ticket.created, message: "Billett opprettet med vellykket kjøpt"})
            } else {
                log.push({timestamp: data.ticket.created, message: "Billett opprettet"})
            }

            if(data.ticket.checked_in) {
                log.push({timestamp: data.ticket.checked_in, message: "Billett sjekket inn"})
            }

            try {
                let ticketTransferLog = await Ticket.getTransferLog(id);
                ticketTransferLog.map((entry) => {
                    log.push({timestamp: entry.created, message: "Billett overført fra " + entry.from_user.firstname + " " + entry.from_user.lastname + " til " + entry.to_user.firstname + " " + entry.to_user.lastname + " " + (entry.reverted ? "– Overførselen ble angret" : "")})
                })
            } catch(e) {
                console.error(e)
            }

            log.sort((a, b) => a.timestamp < b.timestamp)
            setTicketEventLog(log);
            setLoading(false);
        };
        createEventlog();
    }, []);

    const checkinTicket = async () => {
        if(window.confirm("Er du sikker på at du vil sjekke inn denne billetten?")) {
            try {
                await checkinMutation.mutateAsync(data.ticket.ticket_id);
                window.location.reload();
            } catch(e) {
                captureException(e);
                console.error("An error occured while attempting to checkin ticket\n" + e);
            }
        }
    }

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

                                <CardContainer>
                                    <CardContainerIcon>
                                        <CardContainerInnerIcon>
                                            <FontAwesomeIcon icon={faCalendar} />
                                        </CardContainerInnerIcon>
                                    </CardContainerIcon>
                                    <CardContainerText>
                                    <InputLabel small>Opprettelsestidspunkt</InputLabel>
                                        <CardContainerInnerText>{ new Date(data.ticket.created*1000).toLocaleString() }</CardContainerInnerText>
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
                                                    <TableCell flex="1">{ TimestampToDateTime(entry.timestamp, "DD_MM_YYYY_HH_MM_SS") }</TableCell>
                                                    <TableCell flex="5">{ entry.message }</TableCell>
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

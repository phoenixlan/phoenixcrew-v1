import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInnerText, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InputLabel, PanelButton } from "../../../components/dashboard"
import { faArrowDownUpLock,faBan,faCode, faLocationDot, faTicket, faUserGroup, faUserPen } from "@fortawesome/free-solid-svg-icons"
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from "react";
import { PageLoading } from "../../../components/pageLoading";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { TimestampToDateTime } from "../../../components/timestampToDateTime";
import { Notice } from "../../../components/containers/notice";

export const EventDetails = ({event}) => {

    let history = useHistory();

    const [ loading, setLoading ] = useState(true);

    useEffect(async () => {
        setLoading(false);
    }, [])

    if(loading) {
        return (<PageLoading />)
    }
    return (
        <>
            <InnerContainer rowgap>
                {
                    event.cancellation_reason && 
                    <InnerContainerRow>
                        <Notice fillWidth type="warning" visible>
                            Dette arrangementet har blitt kansellert.<br/>
                            Begrunnelse: {event.cancellation_reason}
                        </Notice>
                    </InnerContainerRow>
                }

                <InnerContainerRow>
                    <PanelButton onClick={() => history.push("/event/" + event.uuid + "/edit")} icon={faUserPen}>Rediger arrangement</PanelButton>
                    <PanelButton onClick={() => history.push("/event/" + event.uuid + "/cancel")} icon={faBan}>Kanseller arrangement</PanelButton>
                </InnerContainerRow>
            </InnerContainer>

            <InnerContainer>
                <InnerContainerRow>
                    <InnerContainer flex="1" floattop>
                        <InnerContainerTitle>Generelle innstillinger for arrangementet</InnerContainerTitle>
                        <InnerContainerRow>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faCode} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Arrangement-UUID</InputLabel>
                                    <CardContainerInnerText console>{event.uuid}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                        </InnerContainerRow>
                        <InnerContainerRow nopadding mobileNoGap>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faUserGroup} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                    <InputLabel small>Navn</InputLabel>
                                    <CardContainerInnerText>{event.name}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                        </InnerContainerRow>
                        <InnerContainerRow nopadding mobileNoGap>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon />
                                </CardContainerIcon>
                                <CardContainerText>
                                    <InputLabel small>Tema</InputLabel>
                                    <CardContainerInnerText>{event.theme}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                        </InnerContainerRow>
                        <InnerContainerRow nopadding mobileNoGap>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faLocationDot} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                    <InputLabel small>Sted</InputLabel>
                                    <CardContainerInnerText>{event.location}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                        </InnerContainerRow>
                    </InnerContainer>

                    <InnerContainer flex="1" floattop>
                        <InnerContainerRow>
                            <InnerContainer flex="1" floattop>
                                <InnerContainer flex="1" floattop>
                                    <InnerContainerTitle>Arrangementstid og booking</InnerContainerTitle>
                                    <InnerContainerRow>
                                        <CardContainer>
                                            <CardContainerIcon>
                                                <CardContainerInnerIcon>
                                                    <FontAwesomeIcon icon={faCalendar} />
                                                </CardContainerInnerIcon>
                                            </CardContainerIcon>
                                            <CardContainerText>
                                                <InputLabel small>Arrangementets start</InputLabel>
                                                <CardContainerInnerText>{ TimestampToDateTime(event.start_time, "DD_MM_YYYY_HH_MM") }</CardContainerInnerText>
                                            </CardContainerText>
                                        </CardContainer>
                                    </InnerContainerRow>

                                    <InnerContainerRow>
                                        <CardContainer>
                                            <CardContainerIcon>
                                                <CardContainerInnerIcon />
                                            </CardContainerIcon>
                                            <CardContainerText>
                                                <InputLabel small>Arrangementets slutt</InputLabel>
                                                <CardContainerInnerText>{ TimestampToDateTime(event.end_time, "DD_MM_YYYY_HH_MM") }</CardContainerInnerText>
                                            </CardContainerText>
                                        </CardContainer>
                                    </InnerContainerRow>

                                    <InnerContainerRow>
                                        <CardContainer>
                                            <CardContainerIcon>
                                                <CardContainerInnerIcon />
                                            </CardContainerIcon>
                                            <CardContainerText>
                                                <InputLabel small>Billettslipp</InputLabel>
                                                <CardContainerInnerText>{ TimestampToDateTime(event.booking_time, "DD_MM_YYYY_HH_MM") }</CardContainerInnerText>
                                            </CardContainerText>
                                        </CardContainer>
                                    </InnerContainerRow>

                                    <InnerContainerRow>
                                        <CardContainer>
                                            <CardContainerIcon>
                                                <CardContainerInnerIcon />
                                            </CardContainerIcon>
                                            <CardContainerText>
                                                <InputLabel small>Åpning av prioritert seating</InputLabel>
                                                <CardContainerInnerText>{ TimestampToDateTime(event.booking_time + event.priority_seating_time_delta, "DD_MM_YYYY_HH_MM") }</CardContainerInnerText>
                                            </CardContainerText>
                                        </CardContainer>
                                    </InnerContainerRow>

                                    <InnerContainerRow>
                                        <CardContainer>
                                            <CardContainerIcon>
                                                <CardContainerInnerIcon />
                                            </CardContainerIcon>
                                            <CardContainerText>
                                                <InputLabel small>Åpning av normal seating</InputLabel>
                                                <CardContainerInnerText>{ TimestampToDateTime(event.booking_time + event.seating_time_delta, "DD_MM_YYYY_HH_MM") }</CardContainerInnerText>
                                            </CardContainerText>
                                        </CardContainer>
                                    </InnerContainerRow>
                                </InnerContainer>
                            </InnerContainer>

                            <InnerContainer flex="1" floattop>
                                <InnerContainer>
                                    <InnerContainerTitle>Billetter og øvre aldersgrenser</InnerContainerTitle>
                                    <InnerContainerRow>
                                        <CardContainer>
                                            <CardContainerIcon>
                                                <CardContainerInnerIcon>
                                                    <FontAwesomeIcon icon={faTicket} />
                                                </CardContainerInnerIcon>
                                            </CardContainerIcon>
                                            <CardContainerText>
                                                <InputLabel small>Antall plasser</InputLabel>
                                                <CardContainerInnerText>{ event.max_participants }</CardContainerInnerText>
                                            </CardContainerText>
                                        </CardContainer>
                                    </InnerContainerRow>

                                    <InnerContainerRow>
                                        <CardContainer>
                                            <CardContainerIcon>
                                                <CardContainerInnerIcon>
                                                    <FontAwesomeIcon icon={faArrowDownUpLock} />
                                                </CardContainerInnerIcon>
                                            </CardContainerIcon>
                                            <CardContainerText>
                                                <InputLabel small>Øvre aldersgrense for deltakere</InputLabel>
                                                <CardContainerInnerText>{ event.participant_age_limit_inclusive == -1 ? "Ikke satt" : event.participant_age_limit_inclusive }</CardContainerInnerText>
                                            </CardContainerText>
                                        </CardContainer>
                                    </InnerContainerRow>

                                    <InnerContainerRow>
                                        <CardContainer>
                                            <CardContainerIcon>
                                                <CardContainerInnerIcon />
                                            </CardContainerIcon>
                                            <CardContainerText>
                                                <InputLabel small>Øvre aldersgrense for crew</InputLabel>
                                                <CardContainerInnerText>{ event.crew_age_limit_inclusive == -1 ? "Ikke satt" : event.crew_age_limit_inclusive }</CardContainerInnerText>
                                            </CardContainerText>
                                        </CardContainer>
                                    </InnerContainerRow>
                                </InnerContainer>
                            </InnerContainer>
                        </InnerContainerRow>
                    </InnerContainer>
                </InnerContainerRow>
            </InnerContainer>
        </>
    )
}











/*
<InnerContainer border extramargin>
                    <InputCheckbox label="Kanseller arrangementet" value={cancelEventCheck} onChange={() => changeCancelEventCheck()} disabled />
                </InnerContainer>

                <InnerContainer>
                    <form>
                        <InnerContainerRow>
                            <InnerContainer flex="1">
                                <InnerContainerTitle>Generelle innstillinger for arrangementet</InnerContainerTitle>
                                <InnerContainerRow nopadding nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Navn</InputLabel>
                                        <InputElement type="text" value={event.name} disabled />
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Sted</InputLabel>
                                        <InputElement type="text" value={event.location ? event.location.name : ""} disabled />
                                    </InputContainer>
                                </InnerContainerRow>

                                <InnerContainerRow nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Tema</InputLabel>
                                        <InputElement type="text" value={event.theme} disabled />
                                    </InputContainer>
                                    <InputContainer mobileHide />
                                </InnerContainerRow>
                                
                                <InnerContainerTitle>Billetter og øvre aldersgrense</InnerContainerTitle>
                                <InnerContainerRow nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Antall plasser</InputLabel>
                                        <InputElement type="number" value={event.max_participants} disabled />
                                    </InputContainer>
                                </InnerContainerRow>
                                <InnerContainerRow nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Øvre aldersgrense for crew</InputLabel>
                                        <InputElement type="number" value={event.crew_age_limit_inclusive} disabled />
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Øvre aldersgrense for deltakere</InputLabel>
                                        <InputElement type="number" value={event.participant_age_limit_inclusive} disabled />
                                    </InputContainer>
                                </InnerContainerRow>
                                
                                <InnerContainerTitle>Arrangementstid og booking</InnerContainerTitle>
                                <InnerContainerRow nopadding nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Arrangementstid Start</InputLabel>
                                        <InputElement type="datetime-local" value={new Date(event.start_time*1000).toISOString().slice(0, -8)} disabled />
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Arrangementstid Slutt</InputLabel>
                                        <InputElement type="datetime-local" value={new Date(event.end_time*1000).toISOString().slice(0, -8)} disabled />
                                    </InputContainer>
                                </InnerContainerRow>

                                <InnerContainerRow nopadding nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Billettslipp</InputLabel>
                                        <InputElement type="datetime-local" value={new Date(event.booking_time*1000).toISOString().slice(0, -8)} disabled />
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Prioritert seating</InputLabel>
                                        <InputElement type="datetime-local" value={new Date(event.booking_time*1000+event.priority_seating_time_delta*1000).toISOString().slice(0, -8)} disabled />
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Normal seating</InputLabel>
                                        <InputElement type="datetime-local" value={new Date((event.booking_time*1000)+(event.seating_time_delta*1000)).toISOString().slice(0, -8)} disabled />
                                    </InputContainer>
                                </InnerContainerRow>

                                <InnerContainerRow nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Setekart</InputLabel>
                                        <InputSelect disabled>
                                            <option>...</option>
                                        </InputSelect>
                                    </InputContainer>
                                    <InputContainer mobileHide />
                                </InnerContainerRow>
                                
                            </InnerContainer>
                            <InnerContainer flex="1">
                                <InnerContainerTitle>Kansellering av arrangementet</InnerContainerTitle>
                                <InnerContainerRow nopadding nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Begrunnelse for kansellering <LabelWarning 
                                            title="'Kansellering av arrangementet' er huket av!&#10;Dersom du lagrer vil arrangementet vises som kansellert." 
                                            visible={cancelEventCheck}><FontAwesomeIcon icon={faExclamationTriangle} /></LabelWarning></InputLabel>
                                        <InputElement type="text" defaultValue={cancelEventReason} disabled={!cancelEventCheck} />
                                    </InputContainer>
                                </InnerContainerRow>
                                <InnerContainerTitle>Billett-typer som kan kjøpes</InnerContainerTitle>
                                <InnerContainerRow nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Legg til billett-type</InputLabel>
                                        <InputSelect value={selectedTicketTypeUuid} onChange={changeSelectedTicketType}>
                                            {
                                                ticketTypes.map((type) => (
                                                    <option value={type.uuid}>{type.name} ({type.price},-)</option>
                                                ))
                                            }
                                        </InputSelect>
                                    </InputContainer>
                                    <InputContainer>
                                        <FormButton onClick={addTicketType}>Legg til billett-type</FormButton>
                                    </InputContainer>
                                </InnerContainerRow>
                                <InnerContainerTitle>Billett-typer som allerede kan kjøpes</InnerContainerTitle>
                                <InnerContainerRow>
                                    {
                                        eventTicketTypes.map((ticketType) => (
                                            <p>{ticketType.name} ({ticketType.price},-)</p>
                                        ))
                                    }

                                </InnerContainerRow>
                            </InnerContainer>
                        </InnerContainerRow>
                    </form>
                </InnerContainer>
                */
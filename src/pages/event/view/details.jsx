import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInnerText, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InputLabel, PanelButton } from "../../../components/dashboard";
import { faArrowDownUpLock, faBan, faCircleHalfStroke, faCode, faHeading, faLocationDot, faPlay, faTicket, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from "react";
import { PageLoading } from "../../../components/pageLoading";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { TimestampToDateTime } from "../../../components/timestampToDateTime";
import { Notice } from "../../../components/containers/notice";
import { modifyEvent } from "@phoenixlan/phoenix.js";

export const EventDetails = ({event, refresh}) => {

    let history = useHistory();

    const [ loading, setLoading ] = useState(true);

    const cancelEvent = async (event) => {
        if(!event.cancellation_reason) {
            let cancellation_reason_prompt = window.prompt("Er du sikker på at du vil kansellere dette arrangementet?\nOppgi en begrunnelse for kanselleringen under, og trykk ok for å kansellere.");
            if (cancellation_reason_prompt) {
                try {
                    setLoading(true);
                    await modifyEvent(event.uuid, {"cancellation_reason": cancellation_reason_prompt});
                    await refresh();
                } catch(e) {
                    console.error("An error occured when trying to cancel this event:\n" + e)   
                }
            }
        } else {
            const revoke_cancellation = window.confirm("Er du sikker på at du vil oppheve kanselleringen for dette arrangementet?")
            if (revoke_cancellation) {
                event.cancellation_reason = null;

                try {
                    setLoading(true);
                    await modifyEvent(event.uuid, {"cancellation_reason": null});
                    await refresh();
                } catch(e) {
                    console.error("An error occured when trying to resume this event:\n" + e)   
                }
            }
        }
        setLoading(false);
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
                    {event.cancellation_reason ? <PanelButton onClick={() => cancelEvent(event)} icon={faPlay}>Opphev kansellert arrangement</PanelButton> : <PanelButton onClick={() => cancelEvent(event)} icon={faBan}>Kanseller arrangement</PanelButton>}
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
                                        <FontAwesomeIcon icon={faHeading} />
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
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faCircleHalfStroke} />
                                    </CardContainerInnerIcon>
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
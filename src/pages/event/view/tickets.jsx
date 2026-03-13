import { useEffect, useState } from "react";
import { PageLoading } from "../../../components/pageLoading";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { InnerContainer, InnerContainerRow, InnerContainerTitle, InputLabel, InputSelect, PanelButton, RowBorder } from "../../../components/dashboard";
import { addEventTicketType } from "@phoenixlan/phoenix.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCheck, faCircleCheck }  from '@fortawesome/free-solid-svg-icons'
import { IconContainer, SelectableTableRow, Table, TableBody, TableCell, TableHead, TableRow } from "../../../components/table";

const messages = {
    "event.addTicketTypeTitle": "Legg til billettype",
    "event.addTicketTypeDescription": ["Legg til billettypene som skal være mulig å kjøpe for dette arrangementet.", <br />, "Alle billettene som blir lagt til vil bli synlige på salgsiden med navn, beskrivelse, og pris. De vil bli tilgjengelig for kjøp på datoen og tidspunktet for billettslipp."],
    "event.setSeatmapTitle": "Setekart",
    "event.setSeatmapDescription": ["Dersom arrangementet skal ha plassreservering kan du knytte et setekart til arrangementet. Plassreservering fungerer kun på billetter som har kryss i \"Gir plass\". Hvilken billett som fungerer på hvilken rad/sete bestemmes i setekartet."],
}



export const EventTickets = ({event, ticketTypes, eventTicketTypes, seatMaps, refresh}) => {

    let history = useHistory();

    const [ loading, setLoading ] = useState(true);
    const [ isAddingTicketType, setIsAddingTicketType ] = useState(false);
    const [ isChangingSeatmap, setIsChangingSeatmap ] = useState(false);
    const [ selectedTicketType, setSelectedTicketType ] = useState("");
    const [ selectedSeatmap, setSelectedSeatmap ] = useState(event.seatmap_uuid??"");

    const updateTicketType = (e) => {
        setSelectedTicketType(e.target.value);
    }
    const updateSeatmap = (e) => {
        setSelectedSeatmap(e.target.value);
    }
    const addTicketType = async () => {
        if(!selectedTicketType) {
            alert("No ticket type is selected")
        } else {
            try {
                setIsAddingTicketType(true);
                await addEventTicketType(event.uuid, selectedTicketType);
                await refresh();
            } catch(e) {
                alert("An error occured when adding ticket type to this event.\n\n" + e);
                console.error("An error occured when adding ticket type (" + selectedTicketType + ") to event (" + event.uuid + ").")
            } finally {
                setIsAddingTicketType(false);
            }
        }
    }

    useEffect(async () => {
        setLoading(false);
    }, [])

    if(loading) {
        return (<PageLoading />)
    }
    return (
        <>
            <InnerContainer mobileHide>
                <InnerContainerRow>
                    <InnerContainerRow>
                        <InnerContainer flex="4" nopadding>
                            <InnerContainerTitle>{messages["event.addTicketTypeTitle"]}</InnerContainerTitle>
                            {messages["event.addTicketTypeDescription"]}
                        </InnerContainer>
                        <RowBorder />
                        <InnerContainer flex="2" nopadding>
                            <InputLabel small>Billett-type</InputLabel> 
                            <InputSelect value={selectedTicketType} onChange={updateTicketType}>
                                <option value={""} label="Ikke valgt" />
                                {
                                    ticketTypes.map((type) => (
                                        <option key={type.uuid} value={type.uuid}>{type.name} ({type.price},-)</option>
                                    ))
                                }
                            </InputSelect>
                        </InnerContainer>
                        <InnerContainer flex="1" nopadding>
                            {
                                isChangingSeatmap ? (
                                    <PageLoading />
                                ) : (
                                    <PanelButton fillWidth disabled={!selectedTicketType} type="submit" onClick={() => addTicketType()}>Legg til</PanelButton>
                                )
                            }
                        </InnerContainer>
                    </InnerContainerRow>
                </InnerContainerRow>
            </InnerContainer>

            <InnerContainer mobileHide>
                <InnerContainerRow>
                    <InnerContainerRow>
                        <InnerContainer flex="4" nopadding>
                            <InnerContainerTitle>{messages["event.setSeatmapTitle"]}</InnerContainerTitle>
                            {messages["event.setSeatmapDescription"]}
                        </InnerContainer>
                        <RowBorder />
                        <InnerContainer flex="2" nopadding>
                            <InputLabel small>Setekart</InputLabel> 
                            <InputSelect disabled value={selectedSeatmap} onChange={updateSeatmap}>
                                <option value={""} label="Ikke valgt" />
                                {
                                    seatMaps.map((type) => (
                                        <option key={type.uuid} value={type.uuid}>{type.name}</option>
                                    ))
                                }
                            </InputSelect>
                        </InnerContainer>
                        <InnerContainer flex="1" nopadding>
                            {
                                isChangingSeatmap ? (
                                    <PageLoading />
                                ) : (
                                    <PanelButton fillWidth disabled type="submit">Endre</PanelButton>
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
                            <TableCell as="th" flex="7">Navn</TableCell>
                            <TableCell as="th" flex="2" mobileHide>Pris</TableCell>
                            <TableCell as="th" flex="2" mobileHide center>Gir<br/>adgang</TableCell>
                            <TableCell as="th" flex="2" mobileHide center>Gir<br/>plass</TableCell>
                            <TableCell as="th" flex="2" mobileHide center>Gir<br/>medlemskap</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            eventTicketTypes.sort((a, b) => b.price - a.price).map((ticketType) => {
                                return (
                                    <SelectableTableRow key={ticketType.uuid}>
                                        <TableCell flex="7">{ ticketType.name }</TableCell>
                                        <TableCell flex="2" mobileHide>{ ticketType.price } ,-</TableCell>
                                        <TableCell flex="2" mobileHide center>{ ticketType.grants_admission ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
                                        <TableCell flex="2" mobileHide center>{ ticketType.seatable ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
                                        <TableCell flex="2" mobileHide center>{ ticketType.grants_membership ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
                                    </SelectableTableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </InnerContainer>
        </>
    )
}
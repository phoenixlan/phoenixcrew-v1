import { useEffect, useState } from "react";
import { PageLoading } from "../../../components/pageLoading";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { CardContainer, CardContainerText, DropdownCardContainer, DropdownCardContent, DropdownCardHeader, InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputElement, InputElementDescription, InputLabel, InputSelect, PanelButton, RowBorder } from "../../../components/dashboard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconContainer, Table, TableBody, TableCell, TableHead, TableRow } from "../../../components/table";
import { Notice } from "../../../components/containers/notice";
import { useEventTicketTypeMappings } from "../../../hooks/tickets/useEventTicketTypeMappings";
import { useEventTicketAvailability } from "../../../hooks/tickets/useEventTicketAvailability";
import { useEventTicketTypeMappingCreateMutation } from "../../../hooks/tickets/useEventTicketTypeMappingCreateMutation";
import { useEventTicketTypeMappingDeleteMutation } from "../../../hooks/tickets/useEventTicketTypeMappingDeleteMutation";
import { useEventTicketTypeMappingAccessCodeRotateMutation } from "../../../hooks/tickets/useEventTicketTypeMappingAccessCodeRotateMutation";
import { useEventUpdateMutation } from "../../../hooks/events/useEventUpdateMutation";
import { useBrand } from "../../../contexts/brand";

const messages = {
    "event.setSeatmapTitle": "Setekart",
    "event.setSeatmapDescription": ["Dersom arrangementet skal ha plassreservering kan du knytte et setekart til arrangementet. Plassreservering fungerer kun på billetter som har kryss i \"Gir plass\". Hvilken billett som fungerer på hvilken rad/sete bestemmes i setekartet."],
}

// Ticket types granting admission must be limited by either their own sales cap, or by a capped group
const getUncappedAdmissionMappings = (mappings, ticketSalesCaps) => mappings.filter((mapping) =>
    mapping.ticket_type.grants_admission &&
    mapping.sales_cap === null &&
    !mapping.sales_cap_groups.some((group) => group in ticketSalesCaps)
);

// Groups a mapping belongs to which have no sales cap defined on the event
const getUndefinedGroupMappings = (mappings, ticketSalesCaps) => mappings.flatMap((mapping) =>
    mapping.sales_cap_groups
        .filter((group) => !(group in ticketSalesCaps))
        .map((group) => ({ mapping, group }))
);

// The most tickets of a mapping that can be sold, or null if unlimited. Only ticket types granting admission are limited by groups
const getMaxSellable = (mapping, ticketSalesCaps) => {
    const groups = mapping.ticket_type.grants_admission ? mapping.sales_cap_groups : [];
    const caps = [mapping.sales_cap, ...groups.map((group) => ticketSalesCaps[group])].filter((cap) => cap !== null && cap !== undefined);
    return caps.length ? Math.min(...caps) : null;
}

// Ticket types with seatmap rows associated must not be able to sell more tickets than there are seats in their rows and in rows open to all ticket types
const getOverbookedMappings = (mappings, ticketSalesCaps, seatmap) => {
    const rows = seatmap?.rows ?? [];
    return mappings
        .filter((mapping) => rows.some((row) => row.ticket_type_uuid === mapping.ticket_type.uuid))
        .map((mapping) => ({
            mapping,
            maxSellable: getMaxSellable(mapping, ticketSalesCaps),
            seats: rows
                .filter((row) => row.ticket_type_uuid === mapping.ticket_type.uuid || !row.ticket_type_uuid)
                .reduce((count, row) => count + row.seats.filter((seat) => !seat.is_reserved).length, 0),
        }))
        .filter(({ maxSellable, seats }) => maxSellable === null || maxSellable > seats);
}

export const EventTickets = ({event, ticketTypes, seatMaps, refresh}) => {

    let history = useHistory();
    const { path } = useBrand();

    const [ loading, setLoading ] = useState(true);
    const [ isChangingSeatmap, setIsChangingSeatmap ] = useState(false);
    const [ selectedTicketType, setSelectedTicketType ] = useState("");
    const [ salesCap, setSalesCap ] = useState("");
    const [ salesCapGroups, setSalesCapGroups ] = useState("");
    const [ generateCode, setGenerateCode ] = useState(false);
    const [ showAccessCodes, setShowAccessCodes ] = useState(false);
    const [ selectedSeatmap, setSelectedSeatmap ] = useState(event.seatmap_uuid??"");
    const [ newSalesCapGroup, setNewSalesCapGroup ] = useState("");
    const [ newSalesCapValue, setNewSalesCapValue ] = useState("");

    const [ selectSeatmapDropdownState, setSelectSeatMapDropdownState] = useState(false);

    const { data: mappings = [], isLoading: isLoadingMappings } = useEventTicketTypeMappings(event.uuid);
    const { data: availability } = useEventTicketAvailability(event.uuid);
    const createMappingMutation = useEventTicketTypeMappingCreateMutation(event.uuid);
    const deleteMappingMutation = useEventTicketTypeMappingDeleteMutation();
    const rotateAccessCodeMutation = useEventTicketTypeMappingAccessCodeRotateMutation();
    const updateEventMutation = useEventUpdateMutation(event);

    const updateSeatmap = (e) => {
        setSelectedSeatmap(e.target.value);
    }
    const addTicketType = () => {
        createMappingMutation.mutate({
            ticket_type_uuid: selectedTicketType,
            sales_cap: salesCap === "" ? null : Number(salesCap),
            sales_cap_groups: salesCapGroups.split(",").map((group) => group.trim()).filter((group) => group),
            generate_code: generateCode,
        }, {
            onSuccess: () => {
                setSelectedTicketType("");
                setSalesCap("");
                setSalesCapGroups("");
                setGenerateCode(false);
            },
        });
    }
    const deleteMapping = (mapping) => {
        if(window.confirm("Er du sikker på at du vil fjerne billettypen \"" + mapping.ticket_type.name + "\" fra arrangementet?")) {
            deleteMappingMutation.mutate(mapping.uuid);
        }
    }
    // Users who already unlocked the ticket type with the old code keep access
    const rotateAccessCode = (mapping) => {
        if(window.confirm("Er du sikker på at du vil lage en ny tilgangskode for \"" + mapping.ticket_type.name + "\"? Den gamle koden vil slutte å fungere.")) {
            rotateAccessCodeMutation.mutate(mapping.uuid);
        }
    }
    // Adding a group which already has a sales cap replaces its cap
    const addTicketSalesCap = async () => {
        try {
            await updateEventMutation.mutateAsync({
                ticket_sales_caps: { ...(event.ticket_sales_caps ?? {}), [newSalesCapGroup.trim()]: Number(newSalesCapValue) }
            });
            setNewSalesCapGroup("");
            setNewSalesCapValue("");
            await refresh();
        } catch(e) {
            console.error("An error occured when updating the ticket sales caps of event (" + event.uuid + ").\n" + e)
        }
    }
    const deleteTicketSalesCap = async (group) => {
        if(!window.confirm("Er du sikker på at du vil fjerne salgsgrensen for \"" + group + "\"?")) {
            return;
        }
        try {
            const { [group]: _, ...ticketSalesCaps } = event.ticket_sales_caps ?? {};
            await updateEventMutation.mutateAsync({ ticket_sales_caps: ticketSalesCaps });
            await refresh();
        } catch(e) {
            console.error("An error occured when updating the ticket sales caps of event (" + event.uuid + ").\n" + e)
        }
    }

    useEffect(async () => {
        setLoading(false);
    }, [])

    if(loading || isLoadingMappings) {
        return (<PageLoading />)
    }

    const ticketSalesCaps = event.ticket_sales_caps ?? {};
    const ticketSalesCapEntries = Object.entries(ticketSalesCaps);
    const lintIssues = [
        ...getUncappedAdmissionMappings(mappings, ticketSalesCaps).map((mapping) =>
            `${mapping.ticket_type.name} gir adgang, men mangler salgsgrense`
        ),
        ...getUndefinedGroupMappings(mappings, ticketSalesCaps).map(({ mapping, group }) =>
            `${mapping.ticket_type.name} er knyttet til gruppen "${group}", som ikke er definert`
        ),
        ...getOverbookedMappings(mappings, ticketSalesCaps, seatMaps.find((seatmap) => seatmap.uuid === event.seatmap_uuid)).map(({ mapping, maxSellable, seats }) =>
            `${mapping.ticket_type.name} kan selge ${maxSellable ?? "ubegrenset antall"} billetter, men har kun ${seats} seter`
        ),
    ];

    const mappedTicketTypeUuids = mappings.map((mapping) => mapping.ticket_type.uuid);
    const unmappedTicketTypes = ticketTypes.filter((type) => !mappedTicketTypeUuids.includes(type.uuid));
    const sortedMappings = [...mappings].sort((a, b) => b.ticket_type.price - a.ticket_type.price);

    const remainingByMapping = Object.fromEntries((availability?.ticket_types ?? []).map((entry) => [entry.ticket_type_mapping_uuid, entry.remaining]));
    const remainingByGroup = Object.fromEntries((availability?.groups ?? []).map((entry) => [entry.group, entry.remaining]));

    const createdAccessCode = createMappingMutation.data?.access_code;

    return (
        <>
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

            <InnerContainer desktopHide>
                <InnerContainerRow>
                    <DropdownCardContainer>
                        <DropdownCardHeader title={messages["event.setSeatmapTitle"]} dropdownState={selectSeatmapDropdownState} onClick={() => setSelectSeatMapDropdownState(!selectSeatmapDropdownState)} />
                        <DropdownCardContent dropdownState={selectSeatmapDropdownState}>
                            {messages["event.setSeatmapDescription"]}

                            <InputContainer column>
                                <InputLabel small>Setekart</InputLabel>
                                <InputSelect disabled value={selectedSeatmap} onChange={updateSeatmap}>
                                    <option value={""} label="Ikke valgt" />
                                    {
                                        seatMaps.map((type) => (
                                            <option key={type.uuid} value={type.uuid}>{type.name}</option>
                                        ))
                                    }
                                </InputSelect>
                            </InputContainer>

                            {
                                isChangingSeatmap ? (
                                    <PageLoading />
                                ) : (
                                    <PanelButton fillWidth disabled type="submit">Endre</PanelButton>
                                )
                            }
                        </DropdownCardContent>
                    </DropdownCardContainer>
                </InnerContainerRow>
            </InnerContainer>

            <InnerContainer>
                <InnerContainerRow>
                    <Notice fillWidth type="success" visible={!lintIssues.length}>
                        Salgsgrensene er gyldige.
                    </Notice>
                    <Notice fillWidth type="error" visible={lintIssues.length > 0}>
                        Feil ble funnet
                        <ul>
                            {lintIssues.map((issue) => <li key={issue}>{issue}</li>)}
                        </ul>
                    </Notice>
                </InnerContainerRow>
            </InnerContainer>

            <InnerContainer>
                <InnerContainerTitle>Salgsgrenser</InnerContainerTitle>
                <Notice type="error" visible={updateEventMutation.isError}>
                    {updateEventMutation.error?.message}
                </Notice>
                <InnerContainer rowgap>
                    <Table>
                        <TableHead border>
                            <TableRow>
                                <TableCell as="th" flex="4">Gruppe</TableCell>
                                <TableCell as="th" flex="2">Salgsgrense</TableCell>
                                <TableCell as="th" flex="2">Gjenstående</TableCell>
                                <TableCell as="th" center flex="0 24px"><IconContainer>...</IconContainer></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                ticketSalesCapEntries.map(([group, cap]) => {
                                    return (
                                        <TableRow key={group}>
                                            <TableCell flex="4">{ group }</TableCell>
                                            <TableCell flex="2">{ cap }</TableCell>
                                            <TableCell flex="2">{ group in remainingByGroup ? remainingByGroup[group] : "-" }</TableCell>
                                            <TableCell flex="0 24px" center title="Fjern salgsgrensen"><IconContainer clickable onClick={() => deleteTicketSalesCap(group)}><FontAwesomeIcon icon={faTrash}/></IconContainer></TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                    <InnerContainer>
                        <InnerContainerTitle>Legg til salgsgrense</InnerContainerTitle>
                        <InnerContainerRow nowrap mobileNoGap>
                            <CardContainer>
                                <InputContainer column extramargin>
                                    <InputLabel small>Gruppe</InputLabel>
                                    <InputElement type="text" value={newSalesCapGroup} onChange={(e) => setNewSalesCapGroup(e.target.value)} />
                                </InputContainer>
                            </CardContainer>
                            <CardContainer>
                                <InputContainer column extramargin>
                                    <InputLabel small>Salgsgrense</InputLabel>
                                    <InputElement type="number" min="0" step="1" value={newSalesCapValue} onChange={(e) => setNewSalesCapValue(e.target.value)} />
                                </InputContainer>
                            </CardContainer>
                            <CardContainer>
                                <PanelButton fillWidth disabled={!newSalesCapGroup.trim() || newSalesCapValue === "" || updateEventMutation.isLoading} onClick={() => addTicketSalesCap()}>Legg til</PanelButton>
                            </CardContainer>
                        </InnerContainerRow>
                    </InnerContainer>
                </InnerContainer>
            </InnerContainer>

            <InnerContainer>
                <InnerContainerTitle>Følgende billett-typer kan kjøpes</InnerContainerTitle>
                <Notice type="error" visible={deleteMappingMutation.isError}>
                    {deleteMappingMutation.error?.message}
                </Notice>
                <Notice type="error" visible={rotateAccessCodeMutation.isError}>
                    {rotateAccessCodeMutation.error?.message}
                </Notice>
                <InputCheckbox label="Vis tilgangskoder" value={showAccessCodes} onChange={() => setShowAccessCodes(!showAccessCodes)} />
                <InnerContainer rowgap>
                    <Table>
                        <TableHead border>
                            <TableRow>
                                <TableCell as="th" flex="5">Navn</TableCell>
                                <TableCell as="th" flex="2" mobileHide>Pris</TableCell>
                                <TableCell as="th" flex="2" mobileHide>Salgsgrense</TableCell>
                                <TableCell as="th" flex="4" mobileHide>Grupper</TableCell>
                                <TableCell as="th" flex="2">Gjenstående</TableCell>
                                <TableCell as="th" flex="3" mobileHide>Tilgangskode</TableCell>
                                <TableCell as="th" flex="2" mobileHide center>Gir<br/>adgang</TableCell>
                                <TableCell as="th" flex="2" mobileHide center>Gir<br/>plass</TableCell>
                                <TableCell as="th" flex="2" mobileHide center>Gir<br/>medlemskap</TableCell>
                                <TableCell as="th" center flex="0 24px"><IconContainer>...</IconContainer></TableCell>
                                <TableCell as="th" center flex="0 24px"><IconContainer>...</IconContainer></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                sortedMappings.map((mapping) => {
                                    const ticketType = mapping.ticket_type;
                                    const remaining = remainingByMapping[mapping.uuid];
                                    return (
                                        <TableRow key={mapping.uuid}>
                                            <TableCell flex="5">{ ticketType.name }</TableCell>
                                            <TableCell flex="2" mobileHide>{ ticketType.price } ,-</TableCell>
                                            <TableCell flex="2" mobileHide>{ mapping.sales_cap ?? "-" }</TableCell>
                                            <TableCell flex="4" mobileHide>{ mapping.sales_cap_groups.length ? mapping.sales_cap_groups.join(", ") : "-" }</TableCell>
                                            <TableCell flex="2">{ remaining === undefined ? "-" : remaining === null ? "Ubegrenset" : remaining }</TableCell>
                                            <TableCell flex="3" mobileHide>{ mapping.access_code ? (showAccessCodes ? <code>{mapping.access_code}</code> : <i>Skjult</i>) : null }</TableCell>
                                            <TableCell flex="2" mobileHide center>{ ticketType.grants_admission ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
                                            <TableCell flex="2" mobileHide center>{ ticketType.seatable ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
                                            <TableCell flex="2" mobileHide center>{ ticketType.grants_membership ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
                                            <TableCell flex="0 24px" center title={ mapping.access_code ? "Lag ny tilgangskode" : undefined }>{ mapping.access_code ? <IconContainer clickable onClick={() => rotateAccessCode(mapping)}><FontAwesomeIcon icon={faArrowsRotate}/></IconContainer> : null }</TableCell>
                                            <TableCell flex="0 24px" center title="Fjern billettypen fra arrangementet"><IconContainer clickable onClick={() => deleteMapping(mapping)}><FontAwesomeIcon icon={faTrash}/></IconContainer></TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                    <InnerContainer>
                        <InnerContainerTitle>Legg til billettype</InnerContainerTitle>
                        <Notice type="error" visible={createMappingMutation.isError}>
                            {createMappingMutation.error?.message}
                        </Notice>
                        <Notice type="success" visible={!!createdAccessCode}>
                            <span>Tilgangskode: <code>{createdAccessCode}</code></span>
                        </Notice>
                        <InnerContainerRow nowrap mobileNoGap>
                            <CardContainer>
                                <InputContainer column extramargin>
                                    <InputLabel small>Billett-type</InputLabel>
                                    <InputSelect value={selectedTicketType} onChange={(e) => setSelectedTicketType(e.target.value)}>
                                        <option value={""} label="Ikke valgt" />
                                        {
                                            unmappedTicketTypes.map((type) => (
                                                <option key={type.uuid} value={type.uuid}>{type.name} ({type.price},-)</option>
                                            ))
                                        }
                                    </InputSelect>
                                </InputContainer>
                            </CardContainer>
                            <CardContainer>
                                <InputContainer column extramargin>
                                    <InputLabel small>Salgsgrense (tom = ingen)</InputLabel>
                                    <InputElement type="number" min="0" step="1" value={salesCap} onChange={(e) => setSalesCap(e.target.value)} />
                                </InputContainer>
                            </CardContainer>
                            <CardContainer>
                                <InputContainer column extramargin>
                                    <InputLabel small>Grupper (kommaseparert)</InputLabel>
                                    <InputElement type="text" value={salesCapGroups} onChange={(e) => setSalesCapGroups(e.target.value)} />
                                </InputContainer>
                            </CardContainer>
                            <CardContainer column extramargin>
                                <InputElement id="generate_code" type="checkbox" checked={generateCode} onChange={() => setGenerateCode(!generateCode)} />
                                <CardContainerText>
                                    <InputLabel htmlFor="generate_code">Skjult (tilgangskode)</InputLabel>
                                </CardContainerText>
                            </CardContainer>
                            <CardContainer>
                                <PanelButton fillWidth disabled={!selectedTicketType || createMappingMutation.isLoading} onClick={() => addTicketType()}>Legg til</PanelButton>
                            </CardContainer>
                        </InnerContainerRow>
                        <InnerContainerRow>
                            <InputElementDescription>Finner du ikke billettypen du leter etter?</InputElementDescription>
                        </InnerContainerRow>
                        <InnerContainerRow>
                            <PanelButton onClick={() => history.push(path("/ticket-types/"))}>Rediger billettyper</PanelButton>
                        </InnerContainerRow>
                    </InnerContainer>
                </InnerContainer>
            </InnerContainer>
        </>
    )
}

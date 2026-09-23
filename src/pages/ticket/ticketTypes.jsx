import React , { useState, useContext } from "react";
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCheck, faCircleCheck }  from '@fortawesome/free-solid-svg-icons'
import { PageLoading } from "../../components/pageLoading"
import { Table, TableRow, TableCell, TableHead, IconContainer, TableBody, SelectableTableRow } from "../../components/table";
import { CardContainer, CardContainerDescriptiveText, CardContainerText,DashboardContent, DashboardHeader, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputElement, InputLabel, InputTextArea, PanelButton, SpanLink } from "../../components/dashboard";
import { Notice } from "../../components/containers/notice";
import { AuthenticationContext } from "../../components/authentication";

import { useTicketTypes } from "../../hooks/tickets/useTicketTypes";
import { useTicketTypeCreateMutation } from "../../hooks/tickets/useTicketTypeCreateMutation";
import { useCurrentEvent } from "../../hooks/events/useCurrentEvent";
import { useEventTicketTypes } from "../../hooks/tickets/useEventTicketTypes";
import { useBrand } from "../../contexts/brand";
import { hasAnyBrandPermission } from "../../utils/roles";

const ticketTypeFlags = [
    { name: "refundable", label: "Refunderbar" },
    { name: "seatable", label: "Gir plass" },
    { name: "grants_admission", label: "Gir adgang" },
    { name: "grants_membership", label: "Gir medlemskap" },
    { name: "requires_membership", label: "Krever medlemskap" },
    { name: "transferable", label: "Overførbar" },
];

// Split the flags into rows of two checkboxes each
const ticketTypeFlagRows = ticketTypeFlags.reduce((rows, flag, index) => {
    if(index % 2 === 0) {
        rows.push([]);
    }
    rows[rows.length - 1].push(flag);
    return rows;
}, []);

export const TicketTypeList = () => {
    const { brandUuid } = useBrand();
    const [ visibleUUID, setVisibleUUID ] = useState(false);

    const authContext = useContext(AuthenticationContext);
    const canCreateTicketType = hasAnyBrandPermission(authContext.roles, brandUuid, ["ticket_admin"]);

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
            price: 0,
            description: "",
            refundable: true,
            seatable: false,
            grants_admission: false,
            grants_membership: false,
            requires_membership: false,
            transferable: true,
        }
    });

    const { data: ticketTypes = [], isLoading: isLoadingTicketTypes } = useTicketTypes();
    const { data: currentEvent, isLoading: isLoadingCurrentEvent } = useCurrentEvent(brandUuid);
    const { data: eventTicketTypes = [], isLoading: isLoadingEventTicketTypes } = useEventTicketTypes(currentEvent?.uuid);

    const createTicketTypeMutation = useTicketTypeCreateMutation();

    const eventTicketTypeUuids = eventTicketTypes.map(tt => tt.uuid);
    const loading = isLoadingTicketTypes || isLoadingCurrentEvent || (currentEvent && isLoadingEventTicketTypes);

    const createError = createTicketTypeMutation.error?.message;

    const onSubmit = (ticketType) => {
        createTicketTypeMutation.mutate({ eventBrandUuid: brandUuid, ticketType }, {
            onSuccess: () => reset(),
        });
    }

    if(loading) {
        return (<PageLoading />)
    }

    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Billett-typer
                </DashboardTitle>
            </DashboardHeader>

            <DashboardContent>
                {
                    canCreateTicketType ? (
                        <InnerContainer rowgap>
                            <InnerContainerRow>
                                <InnerContainer flex="1" rowgap>
                                    <Notice type="error" visible={createTicketTypeMutation.isError}>
                                        {createError}
                                    </Notice>
                                    <Notice type="success" visible={createTicketTypeMutation.isSuccess}>
                                        <span>Billett-typen ble opprettet.</span>
                                    </Notice>
                                    <InnerContainer>
                                        <InnerContainerTitle>Opprett billett-type</InnerContainerTitle>
                                        <InnerContainerRow nowrap mobileNoGap>
                                            <CardContainer>
                                                <InputContainer column extramargin>
                                                    <InputLabel small>Navn</InputLabel>
                                                    <InputElement {...register("name", { required: true })} type="text" />
                                                </InputContainer>
                                            </CardContainer>

                                            <CardContainer>
                                                <InputContainer column extramargin>
                                                    <InputLabel small>Pris</InputLabel>
                                                    <InputElement {...register("price", { valueAsNumber: true })} type="number" min="0" />
                                                </InputContainer>
                                            </CardContainer>
                                        </InnerContainerRow>

                                        <InnerContainerRow nowrap mobileNoGap>
                                            <CardContainer>
                                                <InputContainer column extramargin>
                                                    <InputLabel small>Beskrivelse</InputLabel>
                                                    <InputTextArea {...register("description")} />
                                                </InputContainer>
                                            </CardContainer>
                                        </InnerContainerRow>

                                        {
                                            ticketTypeFlagRows.map((row) => (
                                                <InnerContainerRow key={row[0].name} nowrap mobileNoGap>
                                                    {
                                                        row.map((flag) => (
                                                            <CardContainer key={flag.name} column extramargin>
                                                                <InputElement {...register(flag.name)} id={flag.name} type="checkbox" />
                                                                <CardContainerText>
                                                                    <InputLabel htmlFor={flag.name}>{flag.label}</InputLabel>
                                                                </CardContainerText>
                                                            </CardContainer>
                                                        ))
                                                    }
                                                </InnerContainerRow>
                                            ))
                                        }
                                    </InnerContainer>
                                </InnerContainer>
                                <InnerContainer flex="1" mobileHide />
                            </InnerContainerRow>

                            <InnerContainerRow>
                                <InnerContainer flex="1" rowgap>
                                    <Notice fillWidth type="info" visible={true}>
                                        <b>Merk:</b> Billett-typer kan ikke slettes etter at de er opprettet. Ikke opprett billett-typer med mindre du faktisk har tenkt å bruke dem.
                                    </Notice>
                                    <CardContainer>
                                        {
                                            createTicketTypeMutation.isLoading ? (
                                                <PageLoading />
                                            ) : (
                                                <PanelButton fillWidth type="submit" onClick={handleSubmit(onSubmit)}>Opprett billett-type</PanelButton>
                                            )
                                        }
                                    </CardContainer>
                                </InnerContainer>
                                <InnerContainer flex="1" />
                            </InnerContainerRow>
                        </InnerContainer>
                    ) : null
                }

                <InnerContainer>
                    <Table>
                        <TableHead border>
                            <TableRow>
                                <TableCell as="th" flex="8" mobileHide visible={!visibleUUID}>UUID <SpanLink onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? "(Skjul UUID)" : null}</SpanLink></TableCell>
                                <TableCell as="th" flex="7">Navn <SpanLink mobileHide onClick={() => setVisibleUUID(!visibleUUID)}>{visibleUUID ? null : "(Vis UUID)"}</SpanLink></TableCell>
                                <TableCell as="th" flex="2" mobileHide>Pris</TableCell>
                                <TableCell as="th" flex="2" mobileHide center>Gir<br/>adgang</TableCell>
                                <TableCell as="th" flex="2" mobileHide center>Gir<br/>plass</TableCell>
                                <TableCell as="th" flex="2" mobileHide center>Gir<br/>medlemskap</TableCell>
                                <TableCell as="th" flex="2" mobileHide center>Overførbar</TableCell>
                                <TableCell as="th" flex="2" mobileHide center>I bruk</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                ticketTypes.sort((a, b) => b.price - a.price).map((ticketType) => {
                                    return (
                                        <TableRow key={ticketType.uuid} active={!eventTicketTypeUuids.includes(ticketType.uuid)}>
                                            <TableCell consolas flex="8" mobileHide visible={!visibleUUID}>{ ticketType.uuid }</TableCell>
                                            <TableCell flex="7">
                                                { ticketType.name }
                                                { ticketType.description ? <CardContainerDescriptiveText>{ ticketType.description }</CardContainerDescriptiveText> : null }
                                            </TableCell>
                                            <TableCell flex="2" mobileHide>{ ticketType.price } ,-</TableCell>
                                            <TableCell flex="2" mobileHide center>{ ticketType.grants_admission ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
                                            <TableCell flex="2" mobileHide center>{ ticketType.seatable ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
                                            <TableCell flex="2" mobileHide center>{ ticketType.grants_membership ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
                                            <TableCell flex="2" mobileHide center>{ ticketType.transferable ? <IconContainer><FontAwesomeIcon icon={faCheck}/></IconContainer> : null }</TableCell>
                                            <TableCell flex="2" mobileHide center>{ eventTicketTypeUuids.includes(ticketType.uuid) ? <IconContainer color="#388e3c"><FontAwesomeIcon icon={faCircleCheck}/></IconContainer> : null }</TableCell>
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
}

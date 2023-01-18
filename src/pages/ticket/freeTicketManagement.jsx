import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import { TicketType, getCurrentEvent, getEventTickets, Ticket, User } from "@phoenixlan/phoenix.js";
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputLabel, InputSelect } from "../../components/dashboard";
import { FormContainer, FormEntry, FormLabel, FormSelect, FormButton } from '../../components/form';
import { UserSearch } from '../../components/userSearch';
import { Table, Row, Column, TableHeader, IconContainer, SelectableRow } from "../../components/table";
import { PageLoading } from "../../components/pageLoading";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const FreeTicketManagement = () => {
    const [ ticketTypes, setTicketTypes ] = useState([]);
    const [ tickets, setTickets ] = useState([]);
    const [ allTickets, setAllTickets ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ selectedUser, setSelectedUser ] = useState("");
    const [ selectedTicketType, setSelectedTicketType ] = useState("");

    let history = useHistory();

    useEffect(async () => {
        await refreshPage();
    }, [])

    const refreshPage = async () => {
        // TODO do we want more freedom?
        const types = await TicketType.getTicketTypes();

        const event = await getCurrentEvent();
        const tickets = await getEventTickets(event.uuid);

        const validTypes = types.filter(type => type.price === 0);
        setTicketTypes(validTypes);
        if(validTypes.length > 0) {
            setSelectedTicketType(validTypes[0].uuid);
        }

        // TODO filter
        const validTypeUuids = validTypes.map(type => type.uuid);
        setAllTickets(tickets);
        setTickets(tickets.filter(ticket => validTypeUuids.indexOf(ticket.ticket_type.uuid) !== -1));
        setLoading(false);
    }

    const onUserSelected = (uuid) => {
        setSelectedUser(uuid);
    }

    const updateTicketType = (event) => {
        console.log(event.target.value);
    }

    const giveTicket = async () => {
        console.log(`giving ${selectedTicketType} to ${selectedUser}`);
        await setLoading(true);
        await Ticket.createTicket(selectedUser, selectedTicketType);
        await refreshPage();
    }


    if(loading) {
        return (
            <PageLoading />
        )
    }

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
                <InnerContainer>
                    Gratisbilletter er en egen billettype som kan gis ut til enkeltpersoner som f.eks. har vunnet konkurranser, eller til større grupper som har betalt en sum til organisasjonen på forhånd. Å gi ut gratisbilletter er ingen spøk og kan være tapte penger for arrangementet.
                </InnerContainer>
                
                <InnerContainer>
                    <InnerContainerTitle>
                        Opprett og gi ut en ny gratisbillett
                    </InnerContainerTitle>

                    <InnerContainerRow>
                        <InnerContainer flex="1">
                            <UserSearch onUserSelected={onUserSelected}/>
                            <InputContainer column extramargin>
                                <InputLabel small>Billett-type</InputLabel>
                                <InputSelect value={selectedTicketType} onChange={updateTicketType}>
                                    {
                                        ticketTypes.map(type => {
                                            return (<option key={type.uuid}>{type.name}</option >)
                                        })
                                    }
                                </InputSelect>
                            </InputContainer>
                            <FormButton type="submit" onClick={() => giveTicket()}>Gi ut gratisbillett</FormButton>
                        </InnerContainer>
                        <InnerContainer flex="1" mobileHide />
                        <InnerContainer flex="1" mobileHide />
                    </InnerContainerRow>
                </InnerContainer>

                <InnerContainer>
                    <Table>
                        <TableHeader border>
                                <Column flex="1" mobileFlex="2">ID</Column>
                                <Column flex="2" mobileFlex="3">Billett type</Column>
                                <Column flex="4" mobileFlex="7">Nåværende eier</Column>
                                <Column flex="4" mobileHide>Opprinnelig eier</Column>
                                <Column flex="4" mobileHide>Seates av bruker</Column>
                                <Column flex="2" mobileFlex="2">Sete</Column>
                                <Column flex="3" mobileHide>Utsendelsestid</Column>
                                <Column center flex="0 24px" mobileHide title="Trykk for å åpne"><IconContainer>...</IconContainer></Column>
                        </TableHeader>
                        {
                            tickets.map((ticket) => {
                                return (
                                    <SelectableRow title="Trykk for å åpne" onClick={e => {history.push(`/ticket/${ticket.ticket_id}`)}}>
                                        <Column consolas flex="1" mobileFlex="2">#{ ticket.ticket_id }</Column>
                                        <Column flex="2" mobileFlex="3">{ ticket.ticket_type.name }</Column>
                                        <Column flex="4" mobileFlex="7">{ User.getFullName(ticket.owner) }</Column>
                                        <Column flex="4" mobileHide>{ User.getFullName(ticket.buyer) }</Column>
                                        <Column flex="4" mobileHide>{ User.getFullName(ticket.seater) }</Column>
                                        <Column flex="2" mobileFlex="2">{ ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "" }</Column>
                                        <Column flex="3" mobileHide>{ new Date(ticket.created*1000).toLocaleString('no-NO', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'}) }</Column>
                                        <Column flex="0 24px" mobileHide center><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                                    </SelectableRow>
                                )
                            })
                        }
                    </Table>
                </InnerContainer>
            </DashboardContent>
        </>
        
    )
}
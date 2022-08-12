import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { TicketType, getCurrentEvent, getEventTicketTypes, getEventTickets, Ticket, User } from "@phoenixlan/phoenix.js";

import { FormContainer, FormEntry, FormLabel, FormSelect, FormButton } from '../../components/form';
import { UserSearch } from '../../components/userSearch';
import { Table, Row, Column } from "../../components/table";
import { PageLoading } from "../../components/pageLoading"

import Spinner from "react-svg-spinner";

export const FreeTicketManagement = () => {
    const [ ticketTypes, setTicketTypes ] = useState([]);
    const [ tickets, setTickets ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ selectedUser, setSelectedUser ] = useState("");
    const [ selectedTicketType, setSelectedTicketType ] = useState("");

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
        setTickets(tickets);
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
        return (<PageLoading />)
    }

    return (<>
        <h1>Gratisbilletter</h1>
        {
            ticketTypes.length === 0 ? (
                <>
                    <h1>Ingen gratisbillett-typer</h1>
                    <p>Det finnes ingen gratisbillett-typer. Dette er en utviklerfeil.</p>
                </>
            ) : (
                <>
                    <h2>Gratisbilletter i sirkulasjon</h2>
                    <Table>
                        <thead>
                            <Row>
                                <Column>Eier</Column>
                                <Column>Opprinnelig mottaker</Column>
                                <Column>Seater</Column>
                                <Column>Type</Column>
                                <Column>Sete</Column>
                                <Column>Opprettet</Column>
                            </Row>
                        </thead>
                        <tbody>
                            {
                                tickets.map(ticket => {
                                    return (<Row key={ticket.id}>
                                        <Column><Link to={`/user/${ticket.owner.uuid}`}>{User.getFullName(ticket.owner)}</Link></Column>
                                        <Column><Link to={`/user/${ticket.buyer.uuid}`}>{User.getFullName(ticket.buyer)}</Link></Column>
                                        <Column>{ticket.seater ? (<Link to={`/user/${ticket.seater.uuid}`}>{User.getFullName(ticket.seater)}</Link>) : "Ingen"}</Column>
                                        <Column>{ticket.ticket_type.name}</Column>
                                        <Column>{(ticket.seat?.number)??"Ingen"}</Column>
                                        <Column>{new Date(ticket.created*1000).toLocaleString()}</Column>
                                    </Row>)
                                })
                            }
                        </tbody>
                    </Table>
                    <p>{tickets.length} gratisbillett(er) i sirkulasjon</p>
                    <h2>Gi ut gratisbillett</h2>
                    <p>Å gi ut en gratisbillett er ingen spøk - hver billett du gir ut er tapte penger for arrangementet!</p>
                    <FormContainer>
                        <FormEntry>
                            <FormLabel>Bruker</FormLabel>
                            <UserSearch onUserSelected={onUserSelected}/>
                        </FormEntry>
                        <FormEntry>
                            <FormLabel>Billett-type</FormLabel>
                            <FormSelect value={selectedTicketType} onChange={updateTicketType}>
                                {
                                    ticketTypes.map(type => {
                                        return (<option key={type.uuid}>{type.name}</option >)
                                    })
                                }
                            </FormSelect>
                        </FormEntry>
                        <FormEntry>
                            <FormButton onClick={giveTicket}>Gi billett</FormButton>
                        </FormEntry>
                    </FormContainer>
                    <h2>Billett-typer</h2>
                    <Table>
                        <thead>
                            <Row>
                                <Column>UUID</Column>
                                <Column>Navn</Column>
                            </Row>
                        </thead>
                        <tbody>
                            {
                                ticketTypes.map(type => {
                                    return (<Row key={type.uuid}>
                                        <Column>{type.uuid}</Column>
                                        <Column>{type.name}</Column>
                                    </Row>)
                                })
                            }
                        </tbody>
                    </Table>
                    <p>{ticketTypes.length} forskjellig(e) gratisbillett-type(r)</p>
                </>
            )
        }
    </>)
}
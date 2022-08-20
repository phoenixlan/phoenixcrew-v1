import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import styled from 'styled-components';

import { BASE_URL } from "../../"

import { User, Crew, Team } from "@phoenixlan/phoenix.js";

import { Table, Row, Column } from "../../components/table";

const S = {
	Container: styled.div`
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 1em;

		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
    `,
    Avatar: styled.img`
        width: 10em;

    `
}

export const ViewUser = (props) => {
    const { uuid } = useParams();
    const [user, setUser] = useState(null);

    const [ ownedTickets, setOwnedTickets ] = useState([]);
    const [ purchasedTickets, setPurchasedTickets ] = useState([]);
    const [ seatableTickets, setSeatableTickets] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const asyncInner = async () => {
            const user = await User.getUser(uuid);
            if(user) {
                console.log("Fetched user:")
                console.log(user);

                //Fetch more data on the user
                const [_, owned, purchased, seatable] = await Promise.all([
                    await Promise.all(user.positions.map(async (position) => {
                        if(position.crew) {
                            position.crew = await Crew.getCrew(position.crew);
                        }
                    })),
                    await User.getOwnedTickets(uuid),
                    await User.getPurchasedTickets(uuid),
                    await User.getSeatableTickets(uuid)
                ])
                setOwnedTickets(owned)
                setPurchasedTickets(purchased)
                setSeatableTickets(seatable);

                setUser(user)
                setLoading(false);

            } else {
                console.log("Fuck");
            }
        }
        asyncInner().catch(e => {
            console.log(e);
        })
    }, []);


    if(loading) {
        return (<p>loading...</p>)
    }
    return (<S.Container>
        <S.Avatar src={user.avatar_urls.sd} />
        <h1>{user.firstname} {user.lastname}</h1>
        <p><i>{user.uuid}</i></p>
        <Table>
            <tbody>
                <Row>
                    <Column>Fødselsdato</Column>
                    <Column>{user.birthdate}</Column>
                </Row>
                <Row>
                    <Column>Kjønn</Column>
                    <Column>{user.gender == "Gender.male" ? "Mann" : "Kvinne"}</Column>
                </Row>
                <Row>
                    <Column>Telefonnummer</Column>
                    <Column>{user.phone}</Column>
                </Row>
                <Row>
                    <Column>Addresse</Column>
                    <Column>
                        <p>{user.address}</p>
                        <p>{user.postal_code}</p>
                        <p>{user.country_code}</p>
                    </Column>
                </Row>
                <Row>
                    <Column>Sist godkjente TOS</Column>
                    <Column>{user.tos_level}</Column>
                </Row>
                <Row>
                    <Column>Brukernavn</Column>
                    <Column>{user.username}</Column>
                </Row>
            </tbody>
        </Table>
        <h1>Stillinger</h1>
        <ul>
            {
                user.positions.map(position => {
                    if(position.name) {
                        return <li>{position.name}</li>
                    } else if(position.crew) {
                        if(position.team) {
                            return <li>Medlem av {position.team} i {position.crew.name}</li>
                        } else if(position.chief) {
                            return <li>Chief i {position.crew.name}</li>
                        } else {
                            return <li>Medlem av {position.crew.name}</li>
                        }

                    }
                })
            }
        </ul>
        <p>{user.positions.length} stillinger</p>
        <h1>Kjøpte billetter</h1>
        <Table>
            <thead>
                <Row>
                    <Column>ID</Column>
                    <Column>Event</Column>
                    <Column>Seater</Column>
                    <Column>Sete</Column>
                    <Column>Nåværende eier</Column>
                </Row>
            </thead>
            <tbody>
                {
                    purchasedTickets.map(ticket => (
                        <Row key={ticket.ticket_id}>
                            <Column>{ticket.ticket_id}</Column>
                            <Column>{ticket.event_uuid}</Column>
                            <Column>{ticket.seater.firstname} {ticket.seater.lastname}</Column>
                            <Column>{ticket.seat}</Column>
                            <Column>{ticket.owner.firstname} {ticket.seater.lastname}</Column>
                        </Row>
                    ))
                }
            </tbody>
        </Table>
        <h1>Eide billetter</h1>
        <Table>
            <thead>
                <Row>
                    <Column>ID</Column>
                    <Column>Event</Column>
                    <Column>Seater</Column>
                    <Column>Sete</Column>
                    <Column>Kjøper</Column>
                </Row>
            </thead>
            <tbody>
                {
                    ownedTickets.map(ticket => (
                        <Row key={ticket.ticket_id}>
                            <Column>{ticket.ticket_id}</Column>
                            <Column>{ticket.event_uuid}</Column>
                            <Column>{ticket.seater.firstname} {ticket.seater.lastname}</Column>
                            <Column>{ticket.seat}</Column>
                            <Column>{ticket.buyer.firstname} {ticket.buyer.lastname}</Column>
                        </Row>
                    ))
                }
            </tbody>
        </Table>
    </S.Container>)
};
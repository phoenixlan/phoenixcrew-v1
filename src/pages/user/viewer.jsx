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

		background-color: #fadeba;
    `,
    Avatar: styled.img`
        width: 10em;

    `
}

export const ViewUser = (props) => {
    const { uuid } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const asyncInner = async () => {
            const user = await User.getUser(uuid);
            if(user) {
                console.log("Fetched user:")
                console.log(user);

                //Fetch more data on the positions.
                await Promise.all(user.positions.map(async (position) => {
                    if(position.crew) {
                        position.crew = await Crew.getCrew(position.crew);
                    }

                }))

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
        {user.avatar ? (<S.Avatar src={`${BASE_URL}${user.avatar.urls.sd}`} />) : null}
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
                    user.purchased_tickets.map(ticket => (
                        <Row>
                            <Column>{ticket.ticket_id}</Column>
                            <Column>{ticket.event_uuid}</Column>
                            <Column>{ticket.seater_uuid}</Column>
                            <Column>{ticket.seat}</Column>
                            <Column>{ticket.owner_uuid}</Column>
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
                    user.owned_tickets.map(ticket => (
                        <Row>
                            <Column>{ticket.ticket_id}</Column>
                            <Column>{ticket.event_uuid}</Column>
                            <Column>{ticket.seater_uuid}</Column>
                            <Column>{ticket.seat}</Column>
                            <Column>{ticket.buyer_uuid}</Column>
                        </Row>
                    ))
                }
            </tbody>
        </Table>
    </S.Container>)
};
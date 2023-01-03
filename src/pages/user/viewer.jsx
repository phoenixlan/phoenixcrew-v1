import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import styled from 'styled-components';

import { BASE_URL } from "../../"

import { User, Crew, Team } from "@phoenixlan/phoenix.js";

import { Table, Row, Column, TableHeader, SelectableRow, IconContainer } from "../../components/table";
import { PageLoading } from '../../components/pageLoading';
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputElement, InputLabel } from '../../components/dashboard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        width: 256px;
        border: 1px solid rgb(235, 235, 235);
    `
}

export const ViewUser = (props) => {
    const { uuid } = useParams();
    const [user, setUser] = useState(null);

    const [ ownedTickets, setOwnedTickets ] = useState([]);
    const [ purchasedTickets, setPurchasedTickets ] = useState([]);
    const [ seatableTickets, setSeatableTickets] = useState([]);
    const [ crews, setCrews ] = useState([]);

    const [ membershipState, setMembershipState ] = useState(null);
    const [ activationState, setActivationState] = useState(null);
    const [activeContent, setActiveContent] = useState(1);

    const [visibleUUIDPositions, setVisibleUUIDPositions] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const asyncInner = async () => {
            const user = await User.getUser(uuid);
            
            if(user) {
                console.log("Fetched user:")
                console.log(user);

                //Fetch more data on the user
                const [_, owned, purchased, seatable, membershipState, activationState] = await Promise.all([
                    await Promise.all(user.positions.map(async (position) => {
                        if(position.crew) {
                            position.crew = await Crew.getCrew(position.crew);
                        }
                    })),
                    await User.getOwnedTickets(uuid),
                    await User.getPurchasedTickets(uuid),
                    await User.getSeatableTickets(uuid),
                    await User.getUserMembershipStatus(uuid),
                    await User.getUserActivationState(uuid)
                ])
                setOwnedTickets(owned)
                setPurchasedTickets(purchased)
                setSeatableTickets(seatable);
                setMembershipState(membershipState);
                setActivationState(activationState);

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
        return (<PageLoading />)
    }

    return (
        <>
            <DashboardHeader>
                <DashboardTitle>
                    Bruker
                </DashboardTitle>
                <DashboardSubtitle>
                    {user.lastname}, {user.firstname}
                </DashboardSubtitle>
            </DashboardHeader>

            <DashboardBarSelector border>
                <DashboardBarElement active={activeContent == 1} onClick={() => setActiveContent(1)}>Brukerinformasjon</DashboardBarElement>
                <DashboardBarElement active={activeContent == 2} onClick={() => setActiveContent(2)}>Stillinger</DashboardBarElement>
                <DashboardBarElement active={activeContent == 3} onClick={() => setActiveContent(3)}>Billetter</DashboardBarElement>
            </DashboardBarSelector>
            
            <DashboardContent visible={activeContent == 1}>
                <InnerContainer>
                    <form>
                        <InnerContainerRow>
                            <InnerContainer flex="1">
                                <InnerContainerTitle>Personalia og kontaktinformasjon</InnerContainerTitle>
                                <InnerContainerRow nopadding nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Fornavn</InputLabel>
                                        <>{user.firstname}</>
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Etternavn</InputLabel>
                                        <>{user.lastname}</>
                                    </InputContainer>
                                </InnerContainerRow>
                                <InnerContainerRow nopadding nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Telefon</InputLabel>
                                        <>{user.phone}</>
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Foresattes telefon</InputLabel>
                                        <>{user.guardian_phone??"Ikke satt"}</>
                                    </InputContainer>
                                </InnerContainerRow>
                                <InnerContainerRow nopadding nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Epost</InputLabel>
                                        <>{user.email}</>
                                    </InputContainer>
                                    <InputContainer column extramargin />
                                </InnerContainerRow>
                                <InnerContainerRow nopadding nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Fødselsdato</InputLabel>
                                        <>{user.birthdate}</>
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Kjønn</InputLabel>
                                        <>{user.gender == "Gender.male" ? "Mann" : "Kvinne"}</>
                                    </InputContainer>
                                </InnerContainerRow>
                                <InnerContainerRow nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Addresse</InputLabel>
                                        <>{user.address}</>
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Postkode</InputLabel>
                                        <>{user.postal_code}</>
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Landskode</InputLabel>
                                        <>{user.country_code}</>
                                    </InputContainer>
                                </InnerContainerRow>

                                <InnerContainerTitle>Medlemsskap informasjon</InnerContainerTitle>
                                <InnerContainerRow nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Radar Event medlem i år</InputLabel>
                                        <>{membershipState !== null ? (membershipState ? "Ja" : "Nei") : "..."}</>
                                    </InputContainer>
                                </InnerContainerRow>

                                <InnerContainerTitle>Konto informasjon</InnerContainerTitle>
                                <InnerContainerRow nopadding nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Bruker-UUID</InputLabel>
                                        <>{user.uuid}</>
                                    </InputContainer>
                                </InnerContainerRow>
                                <InnerContainerRow nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Brukernavn</InputLabel>
                                        <>{user.username}</>
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>TOS nivå</InputLabel>
                                        <>{user.tos_level}</>
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Bruker aktivert</InputLabel>
                                        <>{activationState !== null ? (activationState ? "Ja" : "Nei") : "..."}</>
                                    </InputContainer>
                                </InnerContainerRow>
                            </InnerContainer>
                            <InnerContainer flex="1">
                                <InnerContainerTitle>Avatar</InnerContainerTitle>
                                <InnerContainer>
                                    <S.Avatar src={user.avatar_urls.sd} />
                                </InnerContainer>
                            </InnerContainer>
                        </InnerContainerRow>
                        
                    </form>
                </InnerContainer>
            </DashboardContent>

            <DashboardContent visible={activeContent == 2}>
                <InnerContainer border extramargin>
                    <InputCheckbox label="Vis UUID" value={visibleUUIDPositions} onChange={() => setVisibleUUIDPositions(!visibleUUIDPositions)} />
                </InnerContainer>
                <Table>
                    <TableHeader border>
                        <Column flex="1" visible={!visibleUUIDPositions}>UUID</Column>
                        <Column flex="2">Navn</Column>
                        <Column flex="0 24px" />
                    </TableHeader>
                </Table>

                {
                user.positions.map((position) => {
                    let positionName;

                    if(position.name) {
                        positionName = position.name;
                    } else if(position.crew_uuid) {
                        if(position.team_uuid) {
                            positionName = "1";
                        } else if(position.chief) {
                            positionName = "Gruppeleder for " + "";
                        } else {
                            positionName = "Medlemmer av " + "";
                        }
                    } else {
                        positionName = "<i>Udefinert stilling</i>";
                    }
        
                    return (
                        <SelectableRow>
                            <Column consolas flex="1" visible={!visibleUUIDPositions}>{ position.uuid }</Column>
                            <Column flex="2" >{positionName}</Column>
                            <Column flex="0 24px"><IconContainer><FontAwesomeIcon /></IconContainer></Column>
                        </SelectableRow>
                    )
                })}
            {/*
                user.positions.map(position => {
                    if(position.name) {
                        return <li>{position.name}</li>
                    } else if(position.crew) {
                        if(position.team_uuid) {
                            return <li>Medlem av {position.team_uuid} i {position.crew.name}</li>
                        } else if(position.chief) {
                            return <li>Chief i {position.crew.name}</li>
                        } else {
                            return <li>Medlem av {position.crew.name}</li>
                        }

                    }
                })
            */}
            </DashboardContent>
        </>
    )


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
                    <Column>Foresattes telefonnummer</Column>
                    <Column>{user.guardian_phone??(<b>Ikke satt</b>)}</Column>
                </Row>
                <Row>
                    <Column>E-post addresse</Column>
                    <Column>{user.email}</Column>
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
                <Row>
                    <Column>Radar-medlem i år?</Column>
                    <Column>{membershipState !== null ? (membershipState ? "Ja" : "Nei") : "Laster"}</Column>
                </Row>
                <Row>
                    <Column>Aktivert konto?</Column>
                    <Column>{activationState !== null ? (activationState ? "Ja" : "Nei") : "Laster"}</Column>
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
                        if(position.team_uuid) {
                            return <li>Medlem av {position.team_uuid} i {position.crew.name}</li>
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
                            <Column>{ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "Ikke seatet"}</Column>
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
                            <Column>{ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "Ikke seatet"}</Column>
                            <Column>{ticket.buyer.firstname} {ticket.buyer.lastname}</Column>
                        </Row>
                    ))
                }
            </tbody>
        </Table>
    </S.Container>)
};
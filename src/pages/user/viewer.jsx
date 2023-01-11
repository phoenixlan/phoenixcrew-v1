import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import { User, Crew, getCurrentEvent } from "@phoenixlan/phoenix.js";
import { Table, Column, TableHeader, SelectableRow, Row, IconContainer } from "../../components/table";
import { PageLoading } from '../../components/pageLoading';
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InnerContainerTitleS, InputCheckbox, InputContainer, InputLabel } from '../../components/dashboard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { position_mapping_to_string } from '../../utils/user';

const S = {
    Avatar: styled.img`
        width: 256px;
        border: 1px solid rgb(235, 235, 235);
    `,
    DiscordAvatar: styled.img`
        width: 3em;
        border-radius: 50%;
    `,
    AlignBottom: styled.div`
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    `
}

const TABS = {
    USER_DETAILS: 1,
    POSITIONS: 2,
    TICKETS: 3,
    INTEGRATIONS: 4
}

const PositionList = ({ position_mappings, showUuid }) => {
    return (
        <>
            {
                position_mappings.map(position_mapping => {
                    const positionName = position_mapping_to_string(position_mapping)

                    return (
                        <SelectableRow>
                            <Column consolas flex="1" visible={!showUuid}>{ position_mapping.position.uuid }</Column>
                            <Column flex="2" >{positionName}</Column>
                            <Column flex="0 24px"><IconContainer><FontAwesomeIcon /></IconContainer></Column>
                        </SelectableRow>
                    )
                })
            }
        </>
    )
}

export const ViewUser = (props) => {
    const { uuid } = useParams();
    const [user, setUser] = useState(null);

    const [ ownedTickets, setOwnedTickets ] = useState([]);
    const [ purchasedTickets, setPurchasedTickets ] = useState([]);
    const [ seatableTickets, setSeatableTickets] = useState([]);
    const [ crews, setCrews ] = useState([]);
    const [ currentEvent, setCurrentEvent ] = useState(null);
    const [ discordMapping, setDiscordMapping ] = useState(null);

    const [ membershipState, setMembershipState ] = useState(null);
    const [ activationState, setActivationState] = useState(null);
    const [activeContent, setActiveContent] = useState(1);

    const [visibleUUIDPositions, setVisibleUUIDPositions] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const asyncInner = async () => {
            const user = await User.getUser(uuid);
            const crews = await Crew.getCrews();
            
            if(user) {
                console.log("Fetched user:")
                console.log(user);

                //Fetch more data on the user
                const [_, owned, purchased, seatable, membershipState, activationState, currentEvent, discordMapping] = await Promise.all([
                    Promise.all(user.position_mappings.map(async (position_mapping) => {
                        const position = position_mapping.position;
                        if(position.crew_uuid) {
                            position.crew = await Crew.getCrew(position.crew_uuid);
                            if(position.team_uuid) {
                                position.team = position.crew.teams.find((team) => team.uuid == position.team_uuid)
                            }
                        }
                    })),
                    User.getOwnedTickets(uuid),
                    User.getPurchasedTickets(uuid),
                    User.getSeatableTickets(uuid),
                    User.getUserMembershipStatus(uuid),
                    User.getUserActivationState(uuid),
                    getCurrentEvent(),
                    User.getDiscordMapping(uuid)
                ])
                setOwnedTickets(owned)
                setPurchasedTickets(purchased)
                setSeatableTickets(seatable);
                setMembershipState(membershipState);
                setActivationState(activationState);
                setCurrentEvent(currentEvent);
                setDiscordMapping(discordMapping);

                setUser(user)
                setCrews(crews);
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
    } else {
        const emailConsent = user.consents.find(consent => consent.consent_type === "ConsentType.event_notification")
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
                    <DashboardBarElement active={activeContent == TABS.USER_DETAILS} onClick={() => setActiveContent(TABS.USER_DETAILS)}>Brukerinformasjon</DashboardBarElement>
                    <DashboardBarElement active={activeContent == TABS.POSITIONS} onClick={() => setActiveContent(TABS.POSITIONS)}>Stillinger</DashboardBarElement>
                    <DashboardBarElement active={activeContent == TABS.TICKETS} onClick={() => setActiveContent(TABS.TICKETS)}>Billetter</DashboardBarElement>
                    <DashboardBarElement active={activeContent == TABS.INTEGRATIONS} onClick={() => setActiveContent(TABS.INTEGRATIONS)}>Tilkoblinger til eksterne tjenester</DashboardBarElement>
                </DashboardBarSelector>
                
                <DashboardContent visible={activeContent == TABS.USER_DETAILS}>
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
                            <InnerContainer>
                                    <InnerContainerTitle>GDPR samtykker</InnerContainerTitle>
                                    <Table>
                                        <TableHeader border>
                                            <Column flex="3">Type</Column>
                                            <Column flex="1">Verdi</Column>
                                            <Column flex="3">Når</Column>
                                            <Column flex="3">Kilde</Column>
                                        </TableHeader>
                                        <SelectableRow>
                                            <Column flex="3">Påminnelse om kommende arrangementer</Column>
                                            <Column flex="1">{ emailConsent ? (<b>Ja</b>) : "Nei" }</Column>
                                            <Column flex="3">{ emailConsent ? (new Date(emailConsent.created*1000).toLocaleString()) : "N/A" }</Column>
                                            <Column flex="3">{ emailConsent ? emailConsent.source : "N/A" }</Column>
                                        </SelectableRow>
                                    </Table>
                                
                            </InnerContainer>
                            
                        </form>
                    </InnerContainer>
                </DashboardContent>

                <DashboardContent visible={activeContent == TABS.POSITIONS}>
                    <InputCheckbox label="Vis UUID" value={visibleUUIDPositions} onChange={() => setVisibleUUIDPositions(!visibleUUIDPositions)} />
                    <InnerContainer border extramargin>
                        <InnerContainerTitle>Nåværende Stillinger</InnerContainerTitle>
                        <Table>
                            <TableHeader border>
                                <Column flex="1" visible={!visibleUUIDPositions}>UUID</Column>
                                <Column flex="2">Navn</Column>
                                <Column flex="0 24px" />
                            </TableHeader>
                            <PositionList show_uuid={visibleUUIDPositions} position_mappings={user.position_mappings.filter(mapping => !mapping.event_uuid || mapping.event_uuid == currentEvent?.uuid )} />
                        </Table>
                    </InnerContainer>
                    <InnerContainer border extramargin>
                        <InnerContainerTitle>Tidligere Stillinger</InnerContainerTitle>
                        <Table>
                            <TableHeader border>
                                <Column flex="1" visible={!visibleUUIDPositions}>UUID</Column>
                                <Column flex="2">Navn</Column>
                                <Column flex="0 24px" />
                            </TableHeader>
                            <PositionList show_uuid={visibleUUIDPositions} position_mappings={user.position_mappings.filter(mapping => mapping.event_uuid && mapping.event_uuid != currentEvent?.uuid )} />
                        </Table>
                    </InnerContainer>
                </DashboardContent>

                <DashboardContent visible={activeContent == TABS.TICKETS}>
                    <InnerContainer border extramargin>
                        <InnerContainerTitleS>Følgende billetter har blitt kjøpt av brukeren</InnerContainerTitleS>
                        <Table>
                            <TableHeader border>
                                <Column flex="1">ID</Column>
                                <Column flex="5">Arrangement</Column>
                                <Column flex="3">Eies av bruker</Column>
                                <Column flex="3">Seates av bruker</Column>
                                <Column flex="1">Seteplass</Column>
                            </TableHeader>

                            {
                                purchasedTickets.map(ticket => (
                                    <SelectableRow>
                                        <Column consolas flex="1">#{ ticket.ticket_id }</Column>
                                        <Column flex="5">{ticket.event_uuid}</Column>
                                        <Column flex="3">{ticket.owner.firstname} {ticket.seater.lastname}</Column>
                                        <Column flex="3">{ticket.seater.firstname} {ticket.seater.lastname}</Column>
                                        <Column flex="1">{ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "Ikke seatet"}</Column>
                                    </SelectableRow>
                                ))
                            }
                        </Table>
                    </InnerContainer>

                    <InnerContainer border extramargin>
                        <InnerContainerTitleS>Følgende billetter eies av brukeren</InnerContainerTitleS>
                        <Table>
                            <TableHeader border>
                                <Column flex="1">ID</Column>
                                <Column flex="5">Arrangement</Column>
                                <Column flex="3">Kjøpt av bruker</Column>
                                <Column flex="3">Seates av bruker</Column>
                                <Column flex="1">Seteplass</Column>
                            </TableHeader>

                            {
                                ownedTickets.map(ticket => (
                                    <SelectableRow>
                                        <Column consolas flex="1">#{ ticket.ticket_id }</Column>
                                        <Column flex="5">{ticket.event_uuid}</Column>
                                        <Column flex="3">{ticket.buyer.firstname} {ticket.buyer.lastname}</Column>
                                        <Column flex="3">{ticket.seater.firstname} {ticket.seater.lastname}</Column>
                                        <Column flex="1">{ticket.seat ? `R${ticket.seat.row.row_number} S${ticket.seat.number}` : "Ikke seatet"}</Column>
                                    </SelectableRow>
                                ))
                            }
                        </Table>
                    </InnerContainer>
                </DashboardContent>

                <DashboardContent visible={activeContent == TABS.INTEGRATIONS}>
                    <InnerContainer flex="1">
                        <InnerContainerRow nopadding nowrap>
                            <InputContainer column extramargin>
                                <InputLabel small>Discord</InputLabel>
                                {
                                    discordMapping ? (
                                        <InnerContainerRow>
                                            <S.DiscordAvatar src={`https://cdn.discordapp.com/avatars/${discordMapping.discord_id}/${discordMapping.avatar}.png`} />
                                            <S.AlignBottom>
                                                {discordMapping.username}
                                            </S.AlignBottom>                                        
                                        </InnerContainerRow>
                                    ) : (<b>Nei</b>)
                                }
                            </InputContainer>
                        </InnerContainerRow>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
};
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import { User, Crew } from "@phoenixlan/phoenix.js";
import { Table, Column, TableHeader, SelectableRow, IconContainer } from "../../components/table";
import { PageLoading } from '../../components/pageLoading';
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InnerContainerTitleS, InputCheckbox, InputContainer, InputLabel } from '../../components/dashboard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const S = {
    Avatar: styled.img`
        width: 256px;
        border: 1px solid rgb(235, 235, 235);
    `
}

const TABS = {
    USER_DETAILS: 1,
    POSITIONS: 2,
    TICKETS: 3
}

const PositionList = ({ position_mappings }) => {
    return (
        <>
            {
                position_mappings.map(position_mapping => {
                    const position = position_mapping.position
                    let positionName = JSON.stringify(position)

                    if(position.name) {
                        positionName = position.name
                    } else if(position.crew) {
                        if(position.team) {
                            positionName = `Medlem av ${position.team.name} i ${position.crew.name}`
                        } else if(position.chief) {
                            positionName = `Chief i ${position.crew.name}`
                        } else {
                            positionName = `Medlem av ${position.crew.name}`
                        }
                    }

                    return (
                        <SelectableRow>
                            <Column consolas flex="1" visible={!visibleUUIDPositions}>{ position.uuid }</Column>
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
                const [_, owned, purchased, seatable, membershipState, activationState, currentEvent] = await Promise.all([
                    await Promise.all(user.position_mappings.map(async (position_mapping) => {
                        const position = position_mapping.position;
                        if(position.crew_uuid) {
                            position.crew = await Crew.getCrew(position.crew_uuid);
                            if(position.team_uuid) {
                                position.team = position.crew.teams.find((team) => team.uuid == position.team_uuid)
                            }
                        }
                    })),
                    await User.getOwnedTickets(uuid),
                    await User.getPurchasedTickets(uuid),
                    await User.getSeatableTickets(uuid),
                    await User.getUserMembershipStatus(uuid),
                    await User.getUserActivationState(uuid),
                    await getCurrentEvent()
                ])
                setOwnedTickets(owned)
                setPurchasedTickets(purchased)
                setSeatableTickets(seatable);
                setMembershipState(membershipState);
                setActivationState(activationState);
                setCurrentEvent(currentEvent);

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
                    <DashboardBarElement active={activeContent == 1} onClick={() => setActiveContent(TABS.USER_DETAILS)}>Brukerinformasjon</DashboardBarElement>
                    <DashboardBarElement active={activeContent == 2} onClick={() => setActiveContent(TABS.POSITIONS)}>Stillinger</DashboardBarElement>
                    <DashboardBarElement active={activeContent == 3} onClick={() => setActiveContent(TABS.TICKETS)}>Billetter</DashboardBarElement>
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
                            
                        </form>
                    </InnerContainer>
                </DashboardContent>

                <DashboardContent visible={activeContent == TABS.POSITIONS}>
                    <InnerContainer border extramargin>
                        <InputCheckbox label="Vis UUID" value={visibleUUIDPositions} onChange={() => setVisibleUUIDPositions(!visibleUUIDPositions)} />
                    </InnerContainer>
                    <h1>Nåværende Stillinger</h1>
                    <Table>
                        <TableHeader border>
                            <Column flex="1" visible={!visibleUUIDPositions}>UUID</Column>
                            <Column flex="2">Navn</Column>
                            <Column flex="0 24px" />
                        </TableHeader>
                        <h1>Nåværende Stillinger</h1>
                        <PositionList position_mappings={user.position_mappings.filter(mapping => !mapping.event_uuid || mapping.event_uuid == currentEvent?.uuid )} />
                    </Table>
                    <Table>
                        <TableHeader border>
                            <Column flex="1" visible={!visibleUUIDPositions}>UUID</Column>
                            <Column flex="2">Navn</Column>
                            <Column flex="0 24px" />
                        </TableHeader>
                        <h1>Tidligere Stillinger</h1>
                        <PositionList position_mappings={user.position_mappings.filter(mapping => mapping.event_uuid && mapping.event_uuid != currentEvent?.uuid )} />
                    </Table>

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
            </>
        )
    }
};
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import { User, Crew, getCurrentEvent } from "@phoenixlan/phoenix.js";
import { Table, Column, TableHeader, SelectableRow, Row, IconContainer } from "../../../components/table";
import { PageLoading } from '../../../components/pageLoading';
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InnerContainerTitleS, InputCheckbox, InputContainer, InputLabel } from '../../../components/dashboard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { position_mapping_to_string } from '../../../utils/user';

const S = {
    Avatar: styled.img`
        width: 256px;
        border: 1px solid rgb(235, 235, 235);
    `,
}

export const UserViewerDetails = ({ user }) => {
    const [ membershipState, setMembershipState ] = useState(null);
    const [ activationState, setActivationState] = useState(null);
    const [ loading, setLoading ] = useState(false);

    const reload = async () => {
        setLoading(true);
        const [ membershipState, activationState ] = await Promise.all([
            User.getUserMembershipStatus(user.uuid),
            User.getUserActivationState(user.uuid),
        ])
        setMembershipState(membershipState);
        setActivationState(activationState);
        setLoading(false);
    }

    useEffect(() => {
        reload();
    }, []);

    const emailConsent = user.consents.find(consent => consent.consent_type === "ConsentType.event_notification")
    if(loading) {
        return (<PageLoading />)
    }
    return (
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
    )
}
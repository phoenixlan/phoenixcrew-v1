import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import { User } from "@phoenixlan/phoenix.js";
import { Table, TableCell, TableHead, SelectableTableRow, TableRow, TableBody } from "../../../components/table";
import { PageLoading } from '../../../components/pageLoading';
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInnerText, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputLabel, PanelButton } from '../../../components/dashboard';

import { Button } from "../../../components/button"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import { faClipboardUser, faCode, faMapPin, faMars, faPhone, faPhoneSlash, faPlus, faPrint, faUserPen, faVenus } from '@fortawesome/free-solid-svg-icons';

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

    const downloadCard = async () => {
        const result = await User.getCrewCard(user.uuid);
        const href = window.URL.createObjectURL(await result.blob());

        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', `card-${user.firstname}-${user.uuid}.png`); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    useEffect(() => {
        reload();
    }, []);

    const emailConsent = user.consents.find(consent => consent.consent_type === "ConsentType.event_notification")
    if(loading) {
        return (<PageLoading />)
    }
    return (
        <>
            <InnerContainer border nopadding extramargin >
                <InnerContainerRow mobileNoGap>
                    <PanelButton onClick={null} icon={faUserPen}>Endre brukeren</PanelButton>
                    <PanelButton onClick={downloadCard} icon={faPrint}>Print crewkort</PanelButton>
                </InnerContainerRow>
            </InnerContainer>
            <InnerContainer>
                
                <InnerContainerRow border>
                    <InnerContainer nopadding>
                        <InnerContainerTitle>Profilbilde</InnerContainerTitle>
                        <InnerContainer>
                            <S.Avatar src={user.avatar_urls.sd} />
                        </InnerContainer>
                    </InnerContainer>
                    <InnerContainer flex="1" mobileRowGap="0em" nopadding>
                        <InnerContainerTitle>Personalia og kontaktinformasjon</InnerContainerTitle>
                        <InnerContainerRow>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faCode} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Bruker-UUID</InputLabel>
                                    <CardContainerInnerText>{user.uuid}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                        </InnerContainerRow>
                        <InnerContainerRow nopadding mobileNoGap>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faUser} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Fornavn, etternavn</InputLabel>
                                    <CardContainerInnerText>{user.firstname}, {user.lastname}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faClipboardUser} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Brukernavn</InputLabel>
                                    <CardContainerInnerText>{user.username}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faMapPin} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Addresse</InputLabel>
                                    <CardContainerInnerText>{user.address}, {user.postal_code}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                        </InnerContainerRow>
                        <InnerContainerRow nopadding mobileNoGap>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Epost</InputLabel>
                                    <CardContainerInnerText title={"Epost: " + user.email}><a href={"mailto:" + user.email}>{user.email}</a></CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faPhone} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Telefon</InputLabel>
                                    <CardContainerInnerText title={"Telefon: " + user.phone}><a href={"tel:" + user.phone}>{user.phone}</a></CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={user.guardian_phone ? faPhone : faPhoneSlash} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Foresattes telefon</InputLabel>
                                    <CardContainerInnerText>{user.guardian_phone ? <a href={"tel:" + user.guardian_phone}>{user.guardian_phone}</a> : "Ikke satt"}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                        </InnerContainerRow>
                        <InnerContainerRow mobileNoGap>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faCalendar} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Fødselsdato</InputLabel>
                                    <span>{user.birthdate}</span>
                                </CardContainerText>
                            </CardContainer>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={user.gender == "Gender.male" ? faMars : faVenus} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Kjønn</InputLabel>
                                    <CardContainerInnerText>{user.gender == "Gender.male" ? "Mann" : "Kvinne"}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                            <CardContainer />
                        </InnerContainerRow>
                    </InnerContainer>
                </InnerContainerRow>


                <InnerContainerRow border>
                    <InnerContainer flex="2">
                        <InnerContainerTitle>Medlemsskap informasjon</InnerContainerTitle>
                        <InnerContainerRow nowrap>
                            <InputContainer column extramargin>
                                <InputLabel small>Radar Event medlem i år</InputLabel>
                                <>{membershipState !== null ? (membershipState ? "Ja" : "Nei") : "..."}</>
                            </InputContainer>
                        </InnerContainerRow>

                        <InnerContainerTitle>Konto informasjon</InnerContainerTitle>
                        <InnerContainerRow nowrap>
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
                    <InnerContainer flex="1" />
                    <InnerContainer flex="2">
                        <InnerContainer>
                            <Button color="lightgray" onClick={downloadCard}>Generer crewkort</Button>
                        </InnerContainer>
                    </InnerContainer>
                </InnerContainerRow>
                <InnerContainer>
                    <InnerContainerTitle>GDPR samtykker</InnerContainerTitle>
                        <Table>
                            <TableHead border>
                                <TableRow>
                                    <TableCell mobileFlex="4" flex="3">Type</TableCell>
                                    <TableCell flex="1">Verdi</TableCell>
                                    <TableCell mobileHide flex="3">Når</TableCell>
                                    <TableCell mobileHide flex="3">Kilde</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <SelectableTableRow>
                                    <TableCell mobileFlex="4" flex="3">Påminnelse: kommende arrangementer</TableCell>
                                    <TableCell flex="1">{ emailConsent ? (<b>Ja</b>) : "Nei" }</TableCell>
                                    <TableCell mobileHide flex="3">{ emailConsent ? (new Date(emailConsent.created*1000).toLocaleString()) : "N/A" }</TableCell>
                                    <TableCell mobileHide flex="3">{ emailConsent ? emailConsent.source : "N/A" }</TableCell>
                                </SelectableTableRow>
                            </TableBody>
                        </Table>
                </InnerContainer>
            </InnerContainer>
        </>
    )
}
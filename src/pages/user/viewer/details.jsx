import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { User } from "@phoenixlan/phoenix.js";
import { Table, TableCell, TableHead, SelectableTableRow, TableRow, TableBody } from "../../../components/table";
import { PageLoading } from '../../../components/pageLoading';
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInnerText, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputLabel, PanelButton } from '../../../components/dashboard';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarRegular, faAddressCard, faCalendar, faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid, faCheck, faCode, faFileContract, faMapPin, faMars, faPhone, faPhoneSlash, faPrint, faUserPen, faVenus } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../../../theme';

const S = {
    Avatar: styled.img`
        width: 256px;
        border: 1px solid ${Colors.Gray200};

        @media screen and (max-width: 480px) {
            width: 100%;
        }
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
                    <PanelButton disabled onClick={null} icon={faUserPen}>Endre brukeren</PanelButton>
                    <PanelButton onClick={downloadCard} icon={faPrint}>Print crewkort</PanelButton>
                    <PanelButton disabled icon={faCheck}>{activationState !== null ? (activationState ? "Konto aktivert" : "Aktiver konto") : "..."}</PanelButton>
                </InnerContainerRow>
            </InnerContainer>
            <InnerContainer>
                
            <InnerContainerRow>
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
                                <CardContainerInnerText console>{user.uuid}</CardContainerInnerText>
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
                                    <FontAwesomeIcon icon={faAddressCard} />
                                </CardContainerInnerIcon>
                            </CardContainerIcon>
                            <CardContainerText>
                            <InputLabel small>Brukernavn / visningsnavn</InputLabel>
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
                                <CardContainerInnerText>{new Date(user.birthdate).toLocaleDateString('no', {year: 'numeric', month: 'long', day: 'numeric'})}</CardContainerInnerText>
                            </CardContainerText>
                        </CardContainer>
                        <CardContainer>
                            <CardContainerIcon>
                                <CardContainerInnerIcon>
                                    <FontAwesomeIcon icon={user.gender === "Gender.male" ? faMars : faVenus} />
                                </CardContainerInnerIcon>
                            </CardContainerIcon>
                            <CardContainerText>
                            <InputLabel small>Kjønn</InputLabel>
                                <CardContainerInnerText>{user.gender === "Gender.male" ? "Mann" : "Kvinne"}</CardContainerInnerText>
                            </CardContainerText>
                        </CardContainer>
                        <CardContainer />
                    </InnerContainerRow>
                    <InnerContainerTitle>Informasjon om medlemsskap</InnerContainerTitle>
                    <InnerContainerRow>
                        <CardContainer>
                            <CardContainerIcon>
                                <CardContainerInnerIcon animation1>
                                    <FontAwesomeIcon icon={membershipState ? faStarSolid : faStarRegular } />
                                </CardContainerInnerIcon>
                            </CardContainerIcon>
                            <CardContainerText>
                            <InputLabel small>Radar Event medlemsskap for gjeldende år</InputLabel>
                                <CardContainerInnerText>{membershipState !== null ? (membershipState ? "Ja" : "Nei") : "Ikke tilgjengelig"}</CardContainerInnerText>
                            </CardContainerText>
                        </CardContainer>
                    </InnerContainerRow>
                    <InnerContainerTitle>Informasjon om terms-of-use</InnerContainerTitle>
                    <InnerContainerRow>
                        <CardContainer>
                            <CardContainerIcon>
                                <CardContainerInnerIcon>
                                    <FontAwesomeIcon icon={faFileContract} />
                                </CardContainerInnerIcon>
                            </CardContainerIcon>
                            <CardContainerText>
                            <InputLabel small>TOS-aksept nivå</InputLabel>
                                <CardContainerInnerText>{user.tos_level}</CardContainerInnerText>
                            </CardContainerText>
                        </CardContainer>
                    </InnerContainerRow>
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
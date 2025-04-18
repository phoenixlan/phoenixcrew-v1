import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { User, Avatar } from "@phoenixlan/phoenix.js";
import { Table, TableCell, TableHead, SelectableTableRow, TableRow, TableBody } from "../../../components/table";
import { PageLoading } from '../../../components/pageLoading';
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInnerText, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InputLabel, PanelButton } from '../../../components/dashboard';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarRegular, faAddressCard, faCalendar, faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid, faCheck, faCode, faFileContract, faMapPin, faMars, faPhone, faPhoneSlash, faPrint, faUserPen, faVenus } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../../../theme';
import { dateOfBirthToAge } from '../../../utils/user';
import { AuthenticationContext } from '../../../components/authentication';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const S = {
    Avatar: styled.img`
        width: inherit;
        border: 1px solid ${Colors.Gray200};
        margin-bottom: 1rem;
        display: flex;

        @media screen and (max-width: 480px) {
            width: 100%;
        }
    `,
}

export const UserViewerDetails = ({ user }) => {

    let history = useHistory();

    // Import the following React contexts:
    const loggedinUser = useContext(AuthenticationContext);

    // Function availibility control:
    let activationStateButtonAvailibility;
    let modifyUserStateButtonAvailibility;
    let deleteAvatarButtonAvailibility;

    const [ membershipState, setMembershipState ] = useState(null);
    const [ activationState, setActivationState ] = useState(null);

    const [ loading, setLoading ] = useState(true);

    // Check if user has "admin" role and make the following functions available:
    if (loggedinUser.roles.includes("admin")) {
        activationStateButtonAvailibility = true;
        modifyUserStateButtonAvailibility = true;
    }

    // Avatar button availability logic, check if the user is him/herself or is admin or hr_admin, and check if the user has an avatar to make the button available:
    if (user.avatar_uuid) {
        if((loggedinUser.roles.includes("admin") || loggedinUser.roles.includes("hr_admin")) || loggedinUser.authUser.uuid == user.uuid) {
            deleteAvatarButtonAvailibility = true;
        }
    }

    const reload = async () => {
        setLoading(true);

        // Try to get user information and set the information as states which can be used later or throw an error.
        try {
            const [ activationState, membershipState ] = await Promise.all([
                User.getUserActivationState(user.uuid),
                User.getUserMembershipStatus(user.uuid)
            ])
            setActivationState(activationState);
            setMembershipState(membershipState);
        } catch(e) {
            console.error("An error occured while attempting to gather user information:\n" + e);
        }

        // Logic finished, show the user details page:
        setLoading(false);
    }

    // Function to activate the user
    const activateUser = async () => {
        if(window.confirm("Er du sikker på at du vil aktivere denne brukeren?")) {
            try { 
                await User.activateUser(user.uuid);
                reload();
            } catch(e) {
                console.error("An error occured while attempting to update the user.\n" + e);
            }
        }
    }

    // Function to delete the user's avatar
    const deleteAvatar = async () => {
        if(window.confirm("Er du sikker på at du vil slette avataren til denne brukeren?")) {
            try { 
                await Avatar.deleteAvatar(user.avatar_uuid);
                window.location.reload();
            } catch(e) {
                console.error("An error occured while attempting to delete this users' avatar.\n" + e);
            }
        }
    }

    // Print crew card
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
            <InnerContainer rowgap>
                <InnerContainerRow>
                    <PanelButton onClick={modifyUserStateButtonAvailibility ? () => history.push("/user/" + user.uuid + "/edit") : null} disabled={!modifyUserStateButtonAvailibility} icon={faUserPen}>Rediger personalia</PanelButton>
                    <PanelButton onClick={activationStateButtonAvailibility ? () => activateUser() : null} disabled={(activationState || !activationStateButtonAvailibility)} icon={faCheck}>{activationState !== null ? (activationState ? "Konto aktivert" : "Aktiver konto") : "Aktiver konto"}</PanelButton>
                    <PanelButton onClick={downloadCard} icon={faPrint}>Print crewkort</PanelButton>
                </InnerContainerRow>
            </InnerContainer>
            
            <InnerContainer rowgap>
                <InnerContainerRow rowgap>
                    <InnerContainer flex="2" floattop>
                        <InnerContainerTitle>Profilbilde</InnerContainerTitle>
                        <InnerContainer>
                            <S.Avatar src={user.avatar_urls.sd} />
                            <InnerContainerRow mobileNoGap nopadding>
                                <PanelButton flex="1" onClick={deleteAvatarButtonAvailibility ? () => deleteAvatar() : null} disabled={(!deleteAvatarButtonAvailibility)}>Slett avatar</PanelButton>
                            </InnerContainerRow>
                        </InnerContainer>
                    </InnerContainer>

                    <InnerContainer flex="5" floattop rowgap>
                        <InnerContainer>
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
                                    <InputLabel small>Adresse</InputLabel>
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
                                        <CardContainerInnerText>{new Date(user.birthdate).toLocaleDateString('no', {year: 'numeric', month: 'long', day: 'numeric'})}, {dateOfBirthToAge(user.birthdate)} år</CardContainerInnerText>
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
                        </InnerContainer>

                        <InnerContainer>
                            <InnerContainerRow>
                                <InnerContainer flex="1" floattop>
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
                                                <CardContainerInnerText>{membershipState !== null ? (membershipState ? "Ja" : "Nei") : "Informasjon ikke tilgjengelig"}</CardContainerInnerText>
                                            </CardContainerText>
                                        </CardContainer>
                                    </InnerContainerRow>
                                </InnerContainer>
                               
                                <InnerContainer flex="1" floattop>
                                    <InnerContainerTitle>Terms-of-use (TOS) godkjenningsnivå</InnerContainerTitle>
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
                        </InnerContainer>
                    </InnerContainer>
                </InnerContainerRow>

                <InnerContainer>
                    <InnerContainerTitle>GDPR samtykker</InnerContainerTitle>
                    <InnerContainer>
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
            </InnerContainer>
        </>
    )
}
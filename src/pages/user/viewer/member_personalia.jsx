
import React, { useContext } from 'react';
import styled from 'styled-components';
import { PageLoading } from '../../../components/pageLoading';
import { Notice } from "../../../components/containers/notice";
import { useUserMemberPersonalia } from '../../../hooks/useUserMemberPersonalia';
import { AuthenticationContext } from '../../../components/authentication';
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInnerText, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputLabel } from '../../../components/dashboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin, faPhone } from '@fortawesome/free-solid-svg-icons';
import { isGlobalAdmin } from '../../../utils/roles';

export const UserViewerMemberPersonalia = ({ user }) => {
    const {data, isLoading } = useUserMemberPersonalia(user.uuid)
    const authContext = useContext(AuthenticationContext);

    if(isLoading) {
        return (<PageLoading />)
    }
    return isGlobalAdmin(authContext.roles) ? (
            <InnerContainer>
                <InnerContainerRow>
                    <InnerContainer flex="1">
                        <InnerContainerTitle>Medlemsinformasjon</InnerContainerTitle>
                        <InnerContainerRow>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faMapPin} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Adresse</InputLabel>
                                    <CardContainerInnerText>{data.address}, {data.postal_code}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                        </InnerContainerRow>
                        <InnerContainerRow>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faPhone} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Telefon</InputLabel>
                                    <CardContainerInnerText title={"Telefon: " + data.phone}><a href={"tel:" + data.phone}>{data.phone}</a></CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                        </InnerContainerRow>
                    </InnerContainer>
                    <InnerContainer flex="3" />
                </InnerContainerRow>
                <InnerContainerRow>
                    <InnerContainer>
                        <InnerContainerRow>
                            <Notice fillWidth type="info" visible={true}>
                                <b>Merk:</b> Denne informasjonen har blitt gitt til oss for å kunne være medlem, og skal ikke brukes til andre formål.
                            </Notice>
                        </InnerContainerRow>
                    </InnerContainer>
                </InnerContainerRow>
            </InnerContainer>
            ) : (
            <InnerContainer>
                <InnerContainerRow>
                    <Notice fillWidth type="warning" visible={true}>
                        Du har ikke riktige tillatelser for å se denne informasjonen
                    </Notice>
                </InnerContainerRow>
            </InnerContainer>
            ) 
}

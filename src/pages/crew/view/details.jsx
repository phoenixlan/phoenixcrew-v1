import { Crew } from "@phoenixlan/phoenix.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInnerText, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InputLabel } from "../../../components/dashboard"
import { faCheck, faCode, faGear, faLink, faPalette, faPen, faUserGroup, faUserPlus, faUserTie } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react";
import { PageLoading } from "../../../components/pageLoading";
import { CrewColorBox } from "../../../components/table";
import { faNoteSticky } from "@fortawesome/free-regular-svg-icons";
import { Notice } from "../../../components/containers/notice";

export const CrewDetails = ({crew}) => {

    return (
        <>
            <InnerContainer>
                <InnerContainerRow>
                    <InnerContainer visible={!crew.active || !crew.is_applyable}>
                        <InnerContainerRow>
                            <Notice fillWidth type="warning" visible={!crew.active || !crew.is_applyable}>
                                {
                                    !crew.active
                                    ? <>Dette crewet er ikke aktivt, og er ikke synlig for brukere med mindre man innehar en administrator rolle.</>
                                    : !crew.is_applyable
                                      ? <>
                                            Crewet er aktivt, men kan ikke søkes til når brukere skal søke seg inn i crew.<br/>
                                            Dersom en bruker skal inn i dette crewet må de legges inn manuelt gjennom stillinger og rettigheter.
                                        </>
                                      : null
                                }
                                <br/>
                                
                            </Notice>
                        </InnerContainerRow>
                    </InnerContainer>

                    <InnerContainer flex="1" floattop>
                        <InnerContainerTitle>Informasjon</InnerContainerTitle>
                        <InnerContainerRow>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faCode} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Stilling-UUID</InputLabel>
                                    <CardContainerInnerText console>{crew.uuid}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                        </InnerContainerRow>

                        <InnerContainerRow>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faPalette} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Farge</InputLabel>
                                    <CardContainerInnerText><CrewColorBox hex={crew.hex_color} /></CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                        </InnerContainerRow>

                        <InnerContainerRow nopadding mobileNoGap>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faUserGroup} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                    <InputLabel small>Navn</InputLabel>
                                    <CardContainerInnerText>{crew.name}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                            
                        </InnerContainerRow>
                        <InnerContainerRow nopadding mobileNoGap>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faPen} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                    <InputLabel small>Beskrivelse</InputLabel>
                                    <CardContainerInnerText displaynewline>{crew.description}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                            
                        </InnerContainerRow>
                    </InnerContainer>

                    <InnerContainer flex="1" floattop rowgap>
                        <InnerContainer>
                            <InnerContainerTitle>Innstillinger</InnerContainerTitle>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Crewet er aktivt</InputLabel>
                                    <CardContainerInnerText>{crew.active ? "Ja" : "Nei"}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faUserPlus} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Crewet kan søkes til</InputLabel>
                                    <CardContainerInnerText>{crew.is_applyable ? "Ja" : "Nei"}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faNoteSticky} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Spesiell søknadstekst</InputLabel>
                                    <CardContainerInnerText>{crew.application_prompt ? "Ja" : "Nei"}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                        </InnerContainer>
                    </InnerContainer>
                </InnerContainerRow>
            </InnerContainer>
        </>
    )
}
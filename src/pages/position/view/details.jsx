import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInnerText, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InputLabel } from "../../../components/dashboard"
import { faCode, faLink, faUserGroup, faUserTie } from "@fortawesome/free-solid-svg-icons"
import { PageLoading } from "../../../components/pageLoading";
import { useCrew } from "../../../hooks/useCrew";

export const PositionDetails = ({position}) => {
    const { data: crew, isLoading } = useCrew(position.crew_uuid);

    if(isLoading) {
        return (<PageLoading />)
    }

    const team = position.team_uuid ? crew?.teams.find((team) => team.uuid == position.team_uuid) : null;

    return (
        <>
            <InnerContainer>
                <InnerContainerRow>
                    <InnerContainer flex="1" floattop>
                        <InnerContainerTitle>Stillingsinformasjon</InnerContainerTitle>
                        <InnerContainerRow>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faCode} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Stilling-UUID</InputLabel>
                                    <CardContainerInnerText console>{position.uuid}</CardContainerInnerText>
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
                                    <InputLabel small>Stillingstittel{position.name ? null : " – Systemgenerert"}</InputLabel>
                                    <CardContainerInnerText>{position.name ? position.name : (position.chief ? "Gruppeleder for " : "Medlemmer av ") + (team ? ` ${team.name} i ` : " ") + (crew?.name ?? "Ukjent crew")}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>

                        </InnerContainerRow>
                        <InnerContainerRow nopadding mobileNoGap>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon />
                                </CardContainerIcon>
                                <CardContainerText>
                                    <InputLabel small>Stillingsbeskrivelse</InputLabel>
                                    <CardContainerInnerText>{position.description}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>

                        </InnerContainerRow>
                    </InnerContainer>

                    <InnerContainer flex="1" floattop rowgap>
                        <InnerContainer>
                            <InnerContainerTitle>Tilknytning til crew</InnerContainerTitle>
                            <InnerContainerRow norowgap nowrap>
                                <CardContainer>
                                    <CardContainerIcon>
                                        <CardContainerInnerIcon>
                                            <FontAwesomeIcon icon={faLink} />
                                        </CardContainerInnerIcon>
                                    </CardContainerIcon>
                                    <CardContainerText>
                                    <InputLabel small>Tilknyttet crew</InputLabel>
                                        <CardContainerInnerText>{crew ? crew.name : "Ikke tilknyttet crew"}</CardContainerInnerText>
                                    </CardContainerText>
                                </CardContainer>
                                <CardContainer />
                            </InnerContainerRow>
                        </InnerContainer>

                        <InnerContainer>
                            <InnerContainerTitle>Innstillinger</InnerContainerTitle>
                                <CardContainer>
                                    <CardContainerIcon>
                                        <CardContainerInnerIcon>
                                            <FontAwesomeIcon icon={faUserTie} />
                                        </CardContainerInnerIcon>
                                    </CardContainerIcon>
                                    <CardContainerText>
                                    <InputLabel small>Gruppeleder stilling</InputLabel>
                                        <CardContainerInnerText>{position.chief ? "Ja" : "Nei"}</CardContainerInnerText>
                                    </CardContainerText>
                                </CardContainer>
                                <CardContainer>
                                    <CardContainerIcon>
                                        <CardContainerInnerIcon>
                                            <FontAwesomeIcon icon={faUserTie} />
                                        </CardContainerInnerIcon>
                                    </CardContainerIcon>
                                    <CardContainerText>
                                    <InputLabel small>Symbolsk stilling</InputLabel>
                                        <CardContainerInnerText>{position.is_vanity ? "Ja" : "Nei"}</CardContainerInnerText>
                                    </CardContainerText>
                                </CardContainer>
                        </InnerContainer>
                    </InnerContainer>
                </InnerContainerRow>
            </InnerContainer>
        </>
    )
}

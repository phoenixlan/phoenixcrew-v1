import { Crew } from "@phoenixlan/phoenix.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInnerText, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InputLabel } from "../../../components/dashboard"
import { faCode, faGear, faLink, faUserGroup, faUserTie } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react";
import { PageLoading } from "../../../components/pageLoading";

export const PositionDetails = ({position}) => {

    const [ loading, setLoading ] = useState(true);
    const [ crew, setCrew ] = useState(undefined);
    const [ team, setTeam ] = useState(undefined);

    useEffect(async () => {
        let crew;
        let team;

        if(position.crew_uuid) {
            crew = await Crew.getCrew(position.crew_uuid);
        }
        if(position.team_uuid) {
            team = crew?.teams.find((team) => team.uuid == position.team_uuid)
        }

        setCrew(crew);
        setTeam(team);

        setLoading(false);
    }, [])

    if(loading) {
        return (<PageLoading />)
    }
    return (
        <>
            <InnerContainer>
                <InnerContainerRow>
                    <InnerContainer flex="3" nopadding>
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
                                <InputLabel small>Tittel{position.name ? null : " – Systemgenerert"}</InputLabel>
                                    <CardContainerInnerText>{position.name ? position.name : (position.chief ? "Gruppeleder for " : "Medlemmer av ") + (team ? ` ${team.name} i ` : " ") + (crew?.name ?? "Ukjent crew")}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                        </InnerContainerRow>
                        <InnerContainerRow>
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faUserTie} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Gruppeleder</InputLabel>
                                    <CardContainerInnerText>{position.chief ? "Ja" : "Nei"}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
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
                            <CardContainer>
                                <CardContainerIcon>
                                    <CardContainerInnerIcon>
                                        <FontAwesomeIcon icon={faLink} />
                                    </CardContainerInnerIcon>
                                </CardContainerIcon>
                                <CardContainerText>
                                <InputLabel small>Tilknyttet team</InputLabel>
                                    <CardContainerInnerText>{team ? team.name : "Ikke tilknyttet team"}</CardContainerInnerText>
                                </CardContainerText>
                            </CardContainer>
                        </InnerContainerRow>
                    </InnerContainer>
                    <InnerContainer flex="1" />
                </InnerContainerRow>
            </InnerContainer>
        </>
    )
}
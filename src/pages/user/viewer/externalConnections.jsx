import React from 'react';
import styled from 'styled-components';
import { PageLoading } from '../../../components/pageLoading';
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInnerText, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InputLabel } from '../../../components/dashboard';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUserDiscordMapping } from '../../../hooks/useUser';

const S = {
    DiscordContainer: styled.div`
        display: flex;
        padding: .5em 0;
    `,
    DiscordAvatar: styled.img`
        width: 2.5em;
        border-radius: 50%;
        margin: 0 1em 0 .5em;
    `,
    DiscordUsername: styled.span`
        margin: auto auto auto 0;
    `,
}


export const UserViewerExternalConnections = ({ user }) => {
    const { data: discordMapping, isLoading } = useUserDiscordMapping(user.uuid);

    if(isLoading) {
        return (<PageLoading />)
    }
    return (
        <InnerContainer >
            <InnerContainerRow>
                <InnerContainer flex="1">
                    <InnerContainerTitle>Eksterne tilkoblinger</InnerContainerTitle>
                    <InnerContainerRow>
                        <CardContainer>
                            <CardContainerIcon>
                                <CardContainerInnerIcon>
                                    <FontAwesomeIcon icon={faDiscord} />
                                </CardContainerInnerIcon>
                            </CardContainerIcon>
                            <CardContainerText>
                                <InputLabel small>Discord bruker</InputLabel>

                                    { discordMapping
                                      ? <S.DiscordContainer>
                                            <S.DiscordAvatar src={`https://cdn.discordapp.com/avatars/${discordMapping.discord_id}/${discordMapping.avatar}.png`} />
                                            <S.DiscordUsername>{discordMapping ? <a href={"https://discordapp.com/users/" + discordMapping.discord_id}>{discordMapping.username}</a> : "Ingen tilkobling"}</S.DiscordUsername>
                                        </S.DiscordContainer>
                                      : <CardContainerInnerText>Ingen tilkobling</CardContainerInnerText>
                                    }


                            </CardContainerText>
                        </CardContainer>
                    </InnerContainerRow>
                </InnerContainer>
                <InnerContainer flex="3" />
            </InnerContainerRow>
        </InnerContainer>
    )
}

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { User} from "@phoenixlan/phoenix.js";
import { PageLoading } from '../../../components/pageLoading';
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInnerText, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputLabel } from '../../../components/dashboard';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const S = {
    DiscordAvatar: styled.img`
        width: 2em;
        border-radius: 50%;
        margin-right: 1em;
    `,
    AlignBottom: styled.div`
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    `
}


export const UserViewerExternalConnections = ({ user }) => {
    const [ loading, setLoading ] = useState(false);
    const [ discordMapping, setDiscordMapping ] = useState(null);

    const reload = async () => {
        setLoading(true);
        setDiscordMapping(await User.getDiscordMapping(user.uuid));
        setLoading(false);
    }

    useEffect(() => {
        reload();
    }, []);

    if(loading) {
        return (<PageLoading />)
    }
    return (
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
                        <CardContainerInnerText>{discordMapping ? <a href={"https://discordapp.com/users/" + discordMapping.discord_id}>{discordMapping.username}</a> : "Ingen tilkobling"}</CardContainerInnerText>
                    </CardContainerText>
                </CardContainer>
            </InnerContainerRow>
        </InnerContainer>
    )
}
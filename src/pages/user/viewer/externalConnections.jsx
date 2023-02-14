import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { User} from "@phoenixlan/phoenix.js";
import { PageLoading } from '../../../components/pageLoading';
import { InnerContainer, InnerContainerRow, InputContainer, InputLabel } from '../../../components/dashboard';

const S = {
    DiscordAvatar: styled.img`
        width: 3em;
        border-radius: 50%;
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
            <InnerContainerRow nopadding nowrap>
                <InputContainer column extramargin>
                    <InputLabel small>Discord</InputLabel>
                    {
                        discordMapping ? (
                            <InnerContainerRow>
                                <S.DiscordAvatar src={`https://cdn.discordapp.com/avatars/${discordMapping.discord_id}/${discordMapping.avatar}.png`} />
                                <S.AlignBottom>
                                    {discordMapping.username}
                                </S.AlignBottom>                                        
                            </InnerContainerRow>
                        ) : (<span>Nei</span>)
                    }
                </InputContainer>
            </InnerContainerRow>
        </InnerContainer>
    )
}
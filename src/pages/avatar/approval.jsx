
import React , { useEffect, useState } from "react";
import styled from "styled-components";

import { Avatar } from "@phoenixlan/phoenix.js";
import { PageLoading } from "../../components/pageLoading"
import { Button } from "../../components/button";

const S = {
    AvatarContainer: styled.div`
    display: flex;
    `,

    AvatarEntry: styled.div`
    width: 20em;
    box-shadow: 0.2em 0.2em 0.5em gray;
    
    `,
    AvatarImage: styled.img`
    width: 100%;
    `,
    DecisionPanel: styled.div`
    `
}

export const AvatarApproval = () => {
    const [avatars, setAvatars] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const refreshAvatars = async () => {
        setLoading(true);
        const avatars = await Avatar.getPendingAvatars();
        setAvatars(avatars);
        setLoading(false)
    }

    useEffect(() => {
        refreshAvatars();
    }, []);

    if(loading) {
        return (<PageLoading />)
    }

    const setApproval = async (uuid, state) => {
        setLoading(true);
        await Avatar.setApproved(uuid, state);
        await refreshAvatars();
    }

    return (<div>
        <h1>Avatarer til godkjenning</h1>
        <S.AvatarContainer>
            {
                avatars.map((avatar) => {
                    return (<S.AvatarEntry key={avatar.uuid}>
                        <S.AvatarImage src={avatar.urls.hd} />
                        <h2>{`${avatar.user.firstname} ${avatar.user.lastname}`}</h2>
                        <S.DecisionPanel>
                            <Button color={"green"} onClick={() => setApproval(avatar.uuid, true)}>Godkjen</Button>
                            <Button onClick={() => setApproval(avatar.uuid, false)}>Avslå</Button>
                        </S.DecisionPanel>
                    </S.AvatarEntry>)
                })
            }
        </S.AvatarContainer>
        </div>)
}
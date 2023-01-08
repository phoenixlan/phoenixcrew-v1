import React , { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "@phoenixlan/phoenix.js";
import { PageLoading } from "../../components/pageLoading"
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerMini, InnerContainerRow, InnerContainerTitleL, InnerContainerTitleS } from "../../components/dashboard";
import { FormButton } from "../../components/form";

const S = {
    AvatarEntry: styled.div`
        display: flex;
        padding: 8px;
        border: 1px solid rgb(235, 235, 235);
        flex: 1 1 28%;
        height: min-content;
        max-width: 292px;
        flex-flow: column;

        @media screen and (max-width: 480px) {
            flex: 1;
            max-width: unset;
        }
    `,
    AvatarImage: styled.img`
        width: 100%;
        margin-bottom: 8px;
    `,
    DecisionPanel: styled.div`
        display: flex;
        flex-flow: column;
        gap: 4px;
    `
}

export const AvatarApproval = () => {
    const [ avatars, setAvatars ] = useState([]);
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
        return (
            <PageLoading />
        )
    }

    const setApproval = async (uuid, state) => {
        setLoading(true);
        await Avatar.setApproved(uuid, state);
        await refreshAvatars();
    }

    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Godkjenning av avatarer
                </DashboardTitle>
                <DashboardSubtitle>
                    {avatars.length} avatar{avatars.length !== 1 ? "er" : ""} trenger godkjenning
                </DashboardSubtitle>
            </DashboardHeader>
            <DashboardContent>
                <InnerContainer>
                    <InnerContainerRow>
                        {
                            avatars.map((avatar) => {
                                return (
                                    <S.AvatarEntry key={avatar.uuid}>
                                        <S.AvatarImage src={avatar.urls.hd} />
                                        <InnerContainerMini>
                                            <InnerContainerTitleL nopadding>{`${avatar.user.firstname} ${avatar.user.lastname}`}</InnerContainerTitleL>
                                            <InnerContainerTitleS>{avatar.user.username}</InnerContainerTitleS>
                                        </InnerContainerMini>
                                        
                                        <S.DecisionPanel>
                                            <FormButton type="submit" onClick={() => setApproval(avatar.uuid, true)}>Godkjenn</FormButton>
                                            <FormButton type="submit" onClick={() => setApproval(avatar.uuid, false)}>Avslå</FormButton>
                                        </S.DecisionPanel>
                                    </S.AvatarEntry>
                                )
                            })
                        }
                    </InnerContainerRow>
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
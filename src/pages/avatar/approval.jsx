import React from "react";
import styled from "styled-components";
import { PageLoading } from "../../components/pageLoading"
import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerMini, InnerContainerRow, InnerContainerTitleL, InnerContainerTitleS } from "../../components/dashboard";
import { FormButton } from "../../components/form";
import { useUnapprovedAvatars } from "../../hooks/useAvatar";
import { useSetAvatarApprovedMutation } from "../../hooks/useAvatarMutation";

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
    const { data: avatars = [], isLoading } = useUnapprovedAvatars();
    const setApprovalMutation = useSetAvatarApprovedMutation();

    if(isLoading) {
        return (
            <PageLoading />
        )
    }

    const setApproval = (uuid, state) => {
        setApprovalMutation.mutate({ uuid, approved: state });
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

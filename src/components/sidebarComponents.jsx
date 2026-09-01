import { faColumns } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import styled from "styled-components";

export const RootContainer = styled.div`
    position: fixed;
    width: 280px;
    height: 100vh;
    display: flex;
    flex-flow: column;
    background-color: rgb(242, 242, 242);
    border-right: 1px solid rgb(235, 235, 235);
    font-size: 0.85rem;
    gap: 0.65rem;
`

export const SidebarSystemHeaderContainer = styled.div`
    display: flex;
    width: 100%;
    padding: 0.35rem 0.35rem 0 0.35rem;
    height: 2rem;
`
export const SystemHeaderIconContainer = styled.div``
export const SystemHeaderTitleContainer = styled.div`
    display: flex;
    flex-flow: column;
`
export const SystemHeaderTitle = styled.span``
export const SystemHeaderSubtitle = styled.span``

export const SidebarAccountContainer = styled.div`
    display: flex;
    flex-flow: row;
`
export const AccountAvatarContainer = styled.div`
    display: flex;
    padding: 0 0.35rem;
`
export const AccountAvatar = styled.img`
    width: 2rem;
    height: 2rem;
    background-color: orange;
`
export const AccountDetails = styled.div`
    display: flex;
    flex-flow: column;
    flex: 1;
`
export const AccountName = styled.span``
export const AccountRole = styled.span``
export const AccountLogoutContainer = styled.div`
    display: flex;
    width: 2rem;
    height: 2rem;
`
export const AccountLogoutButton = styled.span`
    margin: auto;
`


export const SidebarSearchContainer = styled.div`
    padding: 0 0.35rem;
    height: 2rem;
    display: flex;
`
export const SidebarSearch = styled.input`
    flex: 1;
    background-color: rgb(235, 235, 235);
    border: none;
    border-bottom: 1px solid rgb(225, 225, 225);
`

export const SidebarManagementContainer = styled.div`
    display: flex;
    flex-flow: column;
    gap: 1rem;
    overflow-y: scroll;
    flex: 1;
    padding-bottom: .35rem;
`

export const SiteManagementContainer = styled.div`
    display: flex;
    flex-flow: column;
`
export const HeaderContainer = styled.div`
    display: flex;
    flex-flow: row;
    font-size: .85rem;
    padding: 0.35rem;
    gap: 0.15rem;
`
export const TitleContainer = styled.div`
    display: flex;
    flex-flow: column;
`

export const SiteTitleGeneric = styled.span``
export const SiteTitleOrg = styled.span``
export const ManagementElements = styled.div`
    display: flex;
    flex-flow: column;
    gap: .65rem;
`
export const ElementGroup = styled.div`
    display: flex;
    flex-flow: column;
`
export const ElementGroupHeader = styled.div`
    display: flex;
    flex-flow: row;
    padding: 0.35rem;
    gap: .65rem;
    font-size: .85rem;
`
export const ElementGroupIconContainer = styled.div`
    display: flex;
    width: 1rem;
`
export const ElementGroupIcon = styled.span`
    margin: auto;
`

export const ElementGroupTitleContainer = styled.div``
export const ElementGroupTitle = styled.span``

export const ElementGroupEntries = styled.div`
    display: flex;
    flex-flow: column;
    gap: .65rem;
    padding: .65rem 0;
`
export const ElementEntry = styled.div`
    display: flex;
    flex-flow: row;
    font-size: .85rem;
    padding: 0 3.35rem;
    cursor: pointer;
`

export const ElementEntryIconContainer = styled.div``
export const ElementEntryIcon = styled.span``
export const ElementEntryTitleContianer = styled.div``
export const ElementEntryTitle = styled.div``

export const BrandManagementContainer = styled.div`
`

export const EventManagementContainer = styled.div`
`
import React from 'react';
import styled from "styled-components";

import { Sidebar } from "./sidebar"
import { DashboardBlock } from "../components/dashboard";
import { MobileNavigation } from './mobileNavigation';
import { MultitenantSidebar } from './sidebarMultitenant';

const S = {
    DocumentRoot: styled.div`
        display: flex;
        flex-flow: row;

        width: 100%;
        height: 100%;

        @media screen and (max-width: 480px) {
        }
    `,
        
        SidebarRoot: styled.div`
            display: flex;
            width: 254px;

            @media screen and (max-width: 480px) {
                display: none;
                width: 0;
            }
        `,
        MultitenantSidebarRoot: styled.div`
            display: flex;
            width: 280px;

            @media screen and (max-width: 480px) {
                display: none;
                width: 0;
            }
        `,
        DashboardRoot: styled.div`
            width: calc(100% - 254px - 280px);
            overflow-y: scroll;

            @media screen and (max-width: 480px) {
                margin-top: 60px;
                width: 100%;
                padding: 0 1em;
            }
        `
}

export const Container = ({ children }) => {
    return (
        <>
            <MobileNavigation />
            <S.DocumentRoot>
                <S.SidebarRoot>
                    <Sidebar />
                </S.SidebarRoot>
                <S.MultitenantSidebarRoot>
                    <MultitenantSidebar />
                </S.MultitenantSidebarRoot>
                <S.DashboardRoot>
                    <DashboardBlock>
                        {children}
                    </DashboardBlock>
                </S.DashboardRoot>
            </S.DocumentRoot>
        </>
    );
}
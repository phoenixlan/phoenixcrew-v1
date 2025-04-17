import React from 'react';
import styled from "styled-components";

import { Sidebar } from "./sidebar"
import { DashboardBlock } from "../components/dashboard";
import { MobileNavigation } from './mobileNavigation';

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
            width: 254px;

            @media screen and (max-width: 480px) {
                display: none;
                width: 0;
            }
        `,
        DashboardRoot: styled.div`
            width: calc(100% - 254px);
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
                <S.DashboardRoot>
                    <DashboardBlock>
                        {children}
                    </DashboardBlock>
                </S.DashboardRoot>
            </S.DocumentRoot>
        </>
    );
}
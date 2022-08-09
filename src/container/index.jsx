import React from 'react';
import styled from "styled-components";

import { Sidebar } from "./sidebar"
import { DashboardBlock } from "../components/dashboard";

const S = {
    DocumentRoot: styled.div`
        display: flex;
        flex-flow: row;

        width: 100%;
        height: 100%;
    `,
        
        SidebarRoot: styled.div`
            width: 254px;
        `,
        DashboardRoot: styled.div`
            width: calc(100% - 254px);
        `
}

export const Container = ({ children }) => {

    return (
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
    );
}
import React from 'react';
import styled from "styled-components";

import { Sidebar } from "./sidebar"

const S = {
    OuterContainer: styled.div`
        display: flex;

        width: 100%;
        height: 100%;
    `,
    Content: styled.div`
        /*padding: 1em;*/
        width: 100%;
        height: 100%;
        overflow: scroll;
    `
}

export const Container = ({ children }) => {

    return (
        <S.OuterContainer>
            <Sidebar />
            <S.Content>
                {children}
            </S.Content>
        </S.OuterContainer>
    );
}
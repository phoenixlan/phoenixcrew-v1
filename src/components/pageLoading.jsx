import React from 'react';
import styled from "styled-components";

import Spinner from "react-svg-spinner";

const S = {
    Container: styled.div`
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    `,
    ContainerInner: styled.div`
        width: 4em;
        height: 4em;

        svg {
            width: 100%;
            height: 100%;
        }
    `
}

export const PageLoading = () => {
    return (
        <S.Container>
            <S.ContainerInner>
                <Spinner />
            </S.ContainerInner>
        </S.Container>
    )
}

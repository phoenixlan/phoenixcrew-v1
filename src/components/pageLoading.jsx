import React from 'react';
import styled from "styled-components";

import Spinner from "react-svg-spinner";
import Logo from "../assets/phoenixlan_square_logo.png";

const S = {
    Container: styled.div`
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    `,
    Card: styled.div`
        display: flex;
        align-items: center;
        gap: 1rem;
        min-width: 18rem;
        padding: 1.25rem 1.5rem;
        border: 1px solid rgb(235, 235, 235);
        border-radius: .35rem;
        background: white;
        box-shadow: 0 4px 18px rgba(0, 0, 0, .08);
    `,
    Logo: styled.img`
        width: 3rem;
        height: 3rem;
    `,
    ContainerInner: styled.div`
        width: 2.5rem;
        height: 2.5rem;

        svg {
            width: 100%;
            height: 100%;
        }
    `,
    Text: styled.div`
        display: flex;
        flex-flow: column;
        gap: .25rem;
    `,
    Title: styled.span`
        font-size: 1rem;
        font-weight: 500;
    `,
    Detail: styled.span`
        color: rgb(96, 94, 92);
        font-size: .8rem;
    `,
}

export const PageLoading = ({ title = "Laster Phoenix EMS", detail = "Vennligst vent …", showLogo = false }) => {
    return (
        <S.Container>
            <S.Card>
                {showLogo ? <S.Logo src={Logo} alt="Phoenix Event Management System" /> : null}
                <S.ContainerInner>
                    <Spinner color="rgb(255, 75, 157)" />
                </S.ContainerInner>
                <S.Text>
                    <S.Title>{title}</S.Title>
                    <S.Detail>{detail}</S.Detail>
                </S.Text>
            </S.Card>
        </S.Container>
    )
}

import React, { useState } from 'react';
import styled from "styled-components";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const S = {
    CategoryWrapperHeader: styled.div`
        position: relative;
        width: 48px;
        display: flex;

        cursor: pointer;
        user-select: none;

        /*width: 100%;*/
        height: 3em;


        :hover {
        }
    `,

    IconContainer: styled.div`
        font-size: 22px;
        margin: auto;
    `,
    TitleContainer: styled.div`
        z-index: 1;
        white-space: nowrap;
        opacity: ${props => props.visible ? "1" : "0"};
        transition: opacity .07s linear;
        position: absolute;
        background-color: white;
        border: 1px solid rgb(215, 215, 215);
        top: 13px;
        left: 56px;
        padding: 0 16px;
        width: fit-content;
        height: fit-content;
    `,
        TitleHandle: styled.div`
            position: absolute;
            top: 6px;
            left: -5px;
            width: 8px;
            height: 8px;
            transform: rotate(45deg);
            background-color: white;
            border-left: 1px solid rgb(215, 215, 215);
            border-bottom: 1px solid rgb(215, 215, 215);
        `,
        Title: styled.span`
            position: relative;
            font-family: Calibri;
            font-size: 14px;
            bottom: 1px;
        `,
    CategoryContentContainer: styled.div`
        display: ${props => props.isactive ? "flex" : "none"};
        flex-flow: column;
        height: 100vh;
        width: 240px;
        opacity: 1;
        position: fixed;
        top: 0;
        left: 48px;
        background-color: rgb(235, 235, 235);
        overflow: hidden;
    `,
        CategoryContent: styled.div`
            position: relative;
            padding: 0 16px;
            height: min-content;
            width: 100%;
        `,
    PhoenixTitleC: styled.div`
        display: flex;
        flex-flow: column;
        width: 100%;
        height: 48px;
        background-color: rgb(255, 170, 210);
        padding-left: 16px;
    `,
        PhoenixTitle: styled.span`
            font-size: 18px;
            font-family: PhoenixTitle, Calibri;
            margin: auto auto 0 0;
        `,
        PhoenixSiteTitle: styled.span`
            font-size: 12px;
            margin: 0 auto auto 0;
        `,

    CategoryContentContainer: styled.div`
        display: flex;
        flex-flow: column;
        height: 100vh;
        width: 240px;
        opacity: 1;
        position: fixed;
        top: 0;
        left: 48px;
        background-color: rgb(235, 235, 235);
        overflow: hidden;
    `,
        CategoryContent: styled.div`
            display: flex;
            position: relative;
            height: min-content;
            width: 100%;
        `,
    PhoenixTitleC: styled.div`
        display: flex;
        flex-flow: column;
        width: 100%;
        height: 48px;
        background-color: rgb(255, 170, 210);
        padding-left: 16px;
    `,
        PhoenixTitle: styled.span`
            font-size: 18px;
            font-family: PhoenixTitle, Calibri;
            margin: auto auto 0 0;
        `,
        PhoenixSiteTitle: styled.span`
            font-size: 12px;
            margin: 0 auto auto 0;
        `,
    SearchBoxC: styled.div`
        padding: 8px 16px;
        height: 32px;
        border-bottom: 1px solid rgb(225, 225, 225);
    `,
    SearchBox: styled.input`
        font-family: Calibri;
        font-size: 16px;
        background-color: rgb(215, 215, 215);
        padding: 2px 16px;
        margin: auto;
        border: none;
        width: calc(100% - 32px);
        height: 28px;

        &:active, &:focus {
            outline: none;
        }
    `,

}

export const SidebarCategory = ({children, title, icon}) => {
    const [ expanded, setExpanded ] = useState(true);
    const [ visibleTitle, setVisibleTitle ] = useState(false);

    return (
        <>
            <S.CategoryWrapperHeader title={title} >
                <S.IconContainer>
                    <FontAwesomeIcon icon={icon} />
                </S.IconContainer>
            </S.CategoryWrapperHeader>
            {children}
        </>
    )
}
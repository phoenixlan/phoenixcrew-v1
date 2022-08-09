import React from 'react';
import styled from 'styled-components';

import { KeyboardArrowRight } from '@material-ui/icons';





const S = {
    Container: styled.div`
        display: flex;
        flex-flow: column;
        margin-bottom: 60px;
        width: 500px;
        height: auto;
        border: 1px solid #ffb8b8;
        font-family: Calibri;
        font-size: 16px;
        box-shadow: 0px 2px 3px rgb(225 190 190);
        align-self: center;
    `,
    TitleBox: styled.div`
        & h4 {
            font-weight: 600;
            margin: 0;
            text-transform: capitalized;
        }
        padding: 12px 24px;
        background-color: #ef5350;
        
    `,
    ContentBox: styled.div`
        & hr {
            border: 1px solid rgb(210, 210, 210);
            border-width: 0 0 1px 0;
            margin: 24px 0;
        }
        padding: 12px 24px;
        background-color: rgb(255, 255, 255);
        
    `,

    ActionBox: styled.div`
        cursor: pointer;
        display: flex;
        flex-flow: row;
        margin: 12px 0;
        padding: 10px 16px;
        border: 1px solid #81d4fa;
        background-color: #e1f5fe;
    `,

    Left: styled.div`
        order: 1;
        flex: 1 0;
    `,
    Right: styled.div`
        order: 2;
        flex: 0 1;
    `,
    StyledArrowRightIcon: styled(KeyboardArrowRight)`
        position: relative;
        width: 18px;
        height: 18px!important;
        vertical-align: middle;
    `
}

export const InfoContainer = (theme, title, text) => (
    <>
        <S.Container theme={theme}>
            <S.TitleBox>
                <h4>{title}</h4>
            </S.TitleBox>
            <S.ContentBox>
                <p>{text}</p>
            </S.ContentBox>
        </S.Container>
    </>
);
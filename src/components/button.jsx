import React from 'react';
import styled from "styled-components";

const S = {
    Button: styled.div`
        height: 1.2em;
        padding: 0.5em;

        display: flex;
        align-items: center;

        cursor: pointer;
        user-select: none;

        border-radius: 0.2em;
        border: 1px solid white;
        
        background-color: ${(props) => props.color??"red"};

        :hover {
            background-color: rgba(0,0,0,0.2);
        }
    `,
}

export const Button = ({ children, color, onClick }) => {
    return (
        <S.Button color={color} onClick={onClick}>
                { children }
        </S.Button>
    )
}

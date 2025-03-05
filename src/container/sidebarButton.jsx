import React from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";


export const SidebarButton = styled(Link)`
    display: flex;

    cursor: pointer;
    user-select: none;

    width: 100%;

    color: black;
    text-decoration: none;
    padding: 4px 0;
    font-size: 14px;

    &:active, &:hover {
        background-color: rgb(235, 235, 235);
    }
    &:active, &:focus {
        background-color: rgb(215, 215, 215);
    }
`

import React from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";


export const SidebarButton = styled(Link)`
    display: flex;

    cursor: pointer;
    user-select: none;

    width: 48px;

    color: black;
    text-decoration: none;
    padding: 4px 0;
    font-size: 14px;
    font-family: Calibri;
`

import React from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";


export const SidebarButton = styled(Link)`
    display: flex;

    cursor: pointer;
    user-select: none;

    width: 100%;
    height: 3em;

    :hover {
        background-color: rgba(0,0,0,0.2);
    }
`

import React from "react";
import styled from "styled-components";

export const Table = styled.table`
    width: 100%;
`

export const SelectableRow = styled.tr`
    height: 2em;

    cursor: pointer;
    user-select: none;
    
    :hover {
        background-color: rgba(0,0,0,0.3);
    }
`

export const Row = styled.tr`
    height: 2em;
`

export const Column = styled.td`
    padding: 0.25em;
`

export const TableHeader = styled.tr`
    height: 2em;
`
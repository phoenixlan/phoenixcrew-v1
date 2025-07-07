import React from "react";
import styled from "styled-components";

export const Table = styled.table`
    display: flex;
    flex-flow: column;
`
export const TableHead = styled.thead`
    display: flex;
    font-size: 12px;
    font-weight: 500;
    flex-flow: column;
    border-bottom: ${props => props.border ? "1px solid rgb(235, 235, 235)" : "0"};
    gap: .35rem;
`
export const TableBody = styled.tbody`
    display: flex;
    flex-flow: ${props => props.columnReverse ? "column-reverse" : "column"};
    flex: 1;
`

const TableCellHeader = styled.th`
`
const TableCellData = styled.th` 
`

const StyledCell = styled.td`
    display: ${props => props.visible ? "none" : "flex"};
    padding: ${props => props.nopadding ? "0" : "4px 0"};
    font-family: ${props => props.consolas ? "Consolas" : "inherit"};
    position: relative;
    top: ${props => props.consolas ? "0" : "0"};
    flex: ${props => props.flex ? props.flex : "1"};
    color: ${props => props.color ? props.color : "inherit"};
    text-align: ${props => props.center ? "center" : "left"};
    text-transform: ${props => props.uppercase ? "uppercase" : "inherit"};
    font-weight: ${props => props.bold ? "700" : "400"};
    font-style: ${props => props.italic ? "italic" : "normal"};
    overflow: hidden;
    background-color: ${props => props.fillGray ? "rgb(235, 235, 235)" : null};

    @media screen and (max-width: 480px) {
        display: ${props => props.mobileHide ? "none" : ""};
        flex: ${props => props.mobileFlex ? props.mobileFlex : "1"};
    }
`
const CellNowrap = styled.div`
    margin: auto;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`

export const TableCell = (props) => {
    return(
        <StyledCell {...props}>
            <CellNowrap center={props.center}>
                {props.children}
            </CellNowrap>
        </StyledCell>
    )
}

export const CrewColorBox = styled.div`
    background-color: ${props => props.hex ? props.hex : "black"};
    width: 20px;
    height: 20px;
`
export const InnerColumnCenter = styled.span`
    margin: auto;
    text-align: auto
`
export const IconContainer = styled.span`
    color: ${props => props.color ? props.color : "rgb(40, 40, 40)"};
    position: relative;
    margin: auto;
    width: 100%;
    text-align: center;
    font-size: .75rem;
    visibility: ${props => props.hidden ? "hidden" : "visible"};
`

export const SelectableTableRow = styled.tr`
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
    min-height: 2em;
    gap: .35rem;

    cursor: pointer;
    user-select: none;
    color: ${props => props.active ? "rgb(150, 150, 150)" : "inherit"};
    
    :hover {
        background-color: rgb(235, 235, 235);
    }
`

export const TableRow = styled.tr`
    display: flex;
    flex-direction: row;
    flex-flow: row;
    flex-wrap: wrap;
    min-height: 2.25em;
    gap: .35rem;
    color: inherit;
    width: 100%;

    @media screen and (max-width: 480px) {
        display: ${props => props.mobileHide ? "none" : ""};
    }
`

export const Row = styled.tr`
    height: 2em;
`
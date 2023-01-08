import React from "react";
import styled from "styled-components";

export const Table = styled.div`
    display: flex;
    flex-flow: column;
`
export const TableHeader = styled.div`
    display: flex;
    font-size: 12px;
    font-weight: 500;
    border-bottom: ${props => props.border ? "1px solid rgb(235, 235, 235)" : "0"};
    padding-bottom: 2px;
    gap: 4px;
`

const StyledColumn = styled.div`
    display: ${props => props.visible ? "none" : "flex"};
    padding: 4px 0;
    font-family: ${props => props.consolas ? "Consolas" : "inherit"};
    position: relative;
    top: ${props => props.consolas ? "1px" : "0"};
    flex: ${props => props.flex ? props.flex : "1"};
    color: ${props => props.color ? props.color : "inherit"};
    text-align: ${props => props.center ? "center" : "left"};
    text-transform: ${props => props.uppercase ? "uppercase" : "inherit"};
    min-width: 0;
    flex-flow: 0%;
    overflow: hidden;

    @media screen and (max-width: 480px) {
        display: ${props => props.mqhide ? "none" : ""};
        flex: ${props => props.mqflex ? props.mqflex : "1"};
    }
`
const ColumnNowrap = styled.div`
    margin: auto;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`

export const Column = (props) => {
    return(
        <StyledColumn {...props}>
            <ColumnNowrap center={props.center}>
                {props.children}
            </ColumnNowrap>
        </StyledColumn>
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
    color: rgb(40, 40, 40);
    position: relative;
    margin: auto;
    width: 100%;
    text-align: center;
`

export const SelectableRow = styled.tr`
    display: flex;
    flex-direction: row;
    flex-flow: row;
    flex-wrap: wrap;
    height: 2em;
    gap: 4px;

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
    height: 2em;

    color: inherit;
`

export const Row = styled.tr`
    height: 2em;
`
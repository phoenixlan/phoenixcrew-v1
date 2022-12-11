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
`
export const Column = styled.div`
    display: ${props => props.visible ? "none" : "flex"};
    padding: 4px 0;
    font-family: ${props => props.consolas ? "Consolas" : "inherit"};
    position: relative;
    top: ${props => props.consolas ? "2px" : "0"};
    flex: ${props => props.flex ? props.flex : "1"};
    color: ${props => props.color ? props.color : "inherit"};
    text-align: ${props => props.center ? "center" : "left"};
    text-transform: ${props => props.uppercase ? "uppercase" : "inherit"};
`
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
    bottom: 1px;
    margin: auto;
`

export const SelectableRow = styled.tr`
    display: flex;
    flex-flow: row;
    height: 2em;

    cursor: pointer;
    user-select: none;
    color: ${props => props.active ? "rgb(150, 150, 150)" : "inherit"};
    
    :hover {
        background-color: rgb(235, 235, 235);
    }
`

export const Row = styled.tr`
    height: 2em;
`




import React from "react";
import styled from "styled-components";

export const DashboardBlock = styled.div`
    background: white;
    width: 980px;
    margin: auto;
    padding: 8px;

    @media screen and (max-width: 480px) {
        width: 100%;
        padding: 0;
    }
`

export const DashboardHeader = styled.div`
    padding: 20px 0;
    border-bottom: ${props => props.border ? "1px solid rgb(235, 235, 235)" : "0"};
`
export const DashboardBarSelector = styled.div`
    display: flex;
    flex-flow: row;
    border-bottom: ${props => props.border ? "1px solid rgb(235, 235, 235)" : "0"};
    font-family: "Roboto";
    font-size: 14px;
    column-gap: 24px;

    @media screen and (max-width: 480px) {
        overflow-x: auto;
        width: 100%;
        white-space: nowrap;
    }
`
export const DashboardBarElement = styled.div`
    padding: 4px 0;
    font-weight: ${props => props.active ? "600" : "400"};
    border-bottom: ${props => props.active ? "2px solid rgb(255,170,210)" : ""};
    cursor: pointer;

    @media screen and (max-width: 480px) {
        display: ${props => props.mobileHide ? "none" : ""};
    }
`

export const DashboardSubtitle = styled.div`
    font-family: "Roboto";
    font-size: 14px;
    font-weight: lighter;
    color: rgb(96, 94, 92);
    margin: 4px 0;
`

export const DashboardTitle = styled.div`
    font-family: "Roboto";
    font-size: 28px;
    font-weight: lighter;
    color: black;
`

export const DashboardContent = styled.div`
    display: ${props => props.visible == undefined ? "block" : props.visible ? "block" : "none"};
    padding: 20px 0;
    font-family: "Roboto";
    font-size: 14px;
`

export const InnerContainer = styled.div`    
    display: ${props => props.visible == undefined ? "flex" : props.visible ? "flex" : "none"};
    flex-flow: column;
    flex: ${props => props.flex ? props.flex : "undefined"};
    padding-bottom: 20px;
    margin-bottom: ${props => props.extramargin ? "20px" : "0"};
    border-bottom: ${props => props.border ? "1px solid rgb(235, 235, 235)" : "0"};

    @media screen and (max-width: 480px) {
        display: ${props => props.mobileHide ? "none" : ""};
        width: 100%;
        row-gap: ${props => props.mobileRowGap ? props.mobileRowGap : "12px"};
        height: min-content;
    }
`

export const InnerContainerRow = styled.div`
    display: ${props => props.visible == undefined ? "flex" : props.visible ? "flex" : "none"};
    flex: ${props => props.flex ? props.flex : "undefined"};
    flex-flow: row;
    flex-wrap: ${props => props.nowrap ? "nowrap" : "wrap"};
    gap: 25px;
    padding-bottom: ${props => props.nopadding ? "0" : "20px"};
    border-bottom: ${props => props.border ? "1px solid rgb(235, 235, 235)" : "0"};

    @media screen and (max-width: 480px) {
        display: ${props => props.mobileHide ? "none" : ""};
        flex-wrap: wrap;
        flex-flow: ${props => props.mobileFlow ? props.mobileFlow : "column"};
        width: 100%;
        row-gap: ${props => props.mobileNoGap ? "" : "16px"};
    }
`
export const InnerContainerTitleL = styled.h1`    
    font-size: 18px;
    padding-bottom: ${props => props.nopadding ? "0px" : "6px"};
    font-weight: 500;
    margin: 0;
`
export const InnerContainerTitle = styled.h3`    
    font-size: 16px;
    padding-bottom: ${props => props.nopadding ? "0px" : "6px"};
    font-weight: 500;
    margin: 0;
`
export const InnerContainerTitleS = styled.h5`    
    font-size: 14px;
    padding-bottom: ${props => props.nopadding ? "0px" : "6px"};
    font-weight: 500;
    margin: 0;
`
export const InnerContainerMini = styled.div`
    padding-bottom: 8px;
`
export const DisplayControl = styled.div`
    display: ${props => props.visible ? "" : "none"};
`

export const InputLabel = styled.span`
    position: relative;
    font-family: "Roboto";
    font-size: ${props => props.small ? "11px" : "14px"};
    bottom: ${props => props.bottom ? props.bottom : ""};
    top: ${props => props.top ? props.top : ""};
    margin: ${props => props.small ? "0" : "0 6px"};
    color: ${props => props.color ? props.color : "inherit"};
`

export const LabelWarning = styled.span`
    display: ${props => props.visible ? "inline-block" : "none"};
    position: relative;
    left: 2px;
    font-size: inherit;
    color: orange;
`

export const InputContainer = styled.div`
    display: flex;
    flex: ${props => props.flex ? props.flex : "1"};
    flex-flow: ${props => props.column ? "column" : "row"};
    margin-bottom: ${props => props.extramargin ? "18px" : "1px"};

    @media screen and (max-width: 480px) {
        margin-bottom: ${props => props.mqmodify ? "0px" : "inherit"};
        row-gap: 0px;
        display: ${props => props.mobileHide ? "none" : ""};
    }
`

export const InputCheckbox = ({ label, value, onChange, disabled }) => {
    return (
        <>
            <InputContainer mqmodify>
                <input type="checkbox" checked={value} onChange={onChange} disabled={disabled} />
                <InputLabel top="1px">{label}</InputLabel>
            </InputContainer>
        </>
    )
}

export const InputElement = styled.input`
    font-family: "Roboto";
    border: 0;
    padding: 4px 0;
    background-color: rgb(255, 255, 255);
    border-bottom: 1px solid rgb(135, 135, 135);
    outline: none;

    &:focus {
        border-bottom: 1px solid rgb(255,75,157);
    }
    &:disabled {
        background-color: inherit;
        color: rgb(130, 130, 130);
        border-bottom: 1px solid rgb(170,170,170)!important;
    }

    @media screen and (max-width: 480px) {
        &[type="radio"] {
            position: relative;
            bottom: 1px;
            height: 14px;
            width: 14px;
        }
        width: 100%;
    }
`
export const InputTextArea = styled.textarea`
    font-family: "Roboto";
    border: 0;
    padding: 4px 0;
    border-bottom: 1px solid rgb(135, 135, 135);
    outline: none;
    resize: vertical;
    min-height: ${props => props.height ? props.height : "150px"};

    &:focus {
        border-bottom: 1px solid rgb(255,75,157);
    }
    &:disabled {
        background-color: inherit;
        color: rgb(130, 130, 130);
    }
`

export const InputSelect = styled.select`
    font-family: "Roboto";
    border: 0;
    padding: 4px 0;
    border-bottom: 1px solid rgb(135, 135, 135);
    background-color: rgb(255, 255, 255);
    outline: none;

    &:focus {
        border-bottom: 1px solid rgb(255,75,157);
    }
`

const IFrame = styled.iframe`
    border: 1px solid rgb(235, 235, 235);
    width: 100%;
    height: 600px;
`
export const IFrameContainer = ({ src }) => {
    return (
        <>
            <IFrame src={src} />
        </>
    )
}

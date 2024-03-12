import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";
import { Colors } from "../theme";

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
    font-size: .85rem;
    display: ${props => props.visible == undefined ? "flex" : props.visible ? "flex" : "none"};
    flex-flow: column;
    flex: ${props => props.flex ? props.flex : "undefined"};
    padding-bottom: ${props => props.nopadding ? "0" : "20px"};
    margin-bottom: ${props => props.extramargin ? "20px" : "0"};
    border-bottom: ${props => props.border ? "1px solid rgb(235, 235, 235)" : "0"};
    align-items: ${props => props.alignItems ? props.alignItems : "left"};

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
    gap: 2em;
    row-gap: .5em;
    padding-bottom: ${props => props.nopadding ? "0" : "20px"};
    border-bottom: ${props => props.border ? "1px solid rgb(235, 235, 235)" : "0"};

    @media screen and (max-width: 480px) {
        display: ${props => props.mobileHide ? "none" : ""};
        flex-wrap: wrap;
        flex-flow: ${props => props.mobileFlow ? props.mobileFlow : "column"};
        width: 100%;
        row-gap: ${props => props.mobileNoGap ? "0" : "16px"};
    }
`

export const InnerContainerTable = styled.table`
    display: flex;
`
export const InnerContainerTableBody = styled.tbody`
    margin: 0;
    border-spacing: 0;
`
export const InnerContainerTitleL = styled.h1`    
    font-size: 18px;
    padding-bottom: ${props => props.nopadding ? "0px" : "6px"};
    font-weight: 500;
    margin: 0;
`
export const InnerContainerTitle = styled.h3`    
    font-size: 16px;
    padding-bottom: ${props => props.nopadding ? "0px" : ".55em"};
    font-weight: 400;
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
    column-gap: 1em;

    @media screen and (max-width: 480px) {
        margin-bottom: ${props => props.mobileNoMargin ? "0px" : "inherit"};
        row-gap: 0px;
        display: ${props => props.mobileHide ? "none" : ""};
    }

    ${props => props.disabled ? `
        opacity: 0.6;
        user-select: none;
        pointer-events: none;
    ` : null}
`

export const InputCheckbox = ({ label, value, onChange, disabled }) => {
    return (
        <>
            <InputContainer mobileNoMargin>
                <input type="checkbox" checked={value} onChange={onChange} disabled={disabled} />
                <InputLabel top="1px">{label}</InputLabel>
            </InputContainer>
        </>
    )
}

export const InputElementDescription = styled.span`
    font-size: .7rem;
`
export const FormContainer = styled.form`
    display: flex;
`

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

    &[type="checkbox"] {
        position: relative;
        bottom: 1px;
        margin-right: .5em;
        margin-bottom: auto;
    }

    @media screen and (max-width: 480px) {
        &[type="radio"] {
            position: relative;
            bottom: 1px;
            height: 1em;
            width: 1em;
        }
        &[type="checkbox"] {
            position: relative;
            bottom: 1px;
            height: 1em;
            width: 1em;
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
    padding: 3px 0;
    border-bottom: 1px solid rgb(135, 135, 135);
    background-color: rgb(255, 255, 255);
    outline: none;

    &:focus {
        border-bottom: 1px solid rgb(255,75,157);
    }
`

export const InputButton = styled.button`
    height: 2.5em;
    width: 100%;
`

const ButtonContainer = styled.button`
    display: flex;
    flex-flow: row;
    min-height: 2rem;
    width: fit-content;
    font-size: .85rem;
    padding: 0 1em;
    border: 0;
    cursor: pointer;
    background-color: ${Colors.Gray100};
    flex: ${props => props.flex ? "1" : null};
    border: 1px solid ${Colors.Gray200};

    &[disabled] {
        cursor: not-allowed;
    }
    &[disabled], &[disabled]:active, &[disabled]:hover {
        cursor: not-allowed;
        background-color: ${Colors.Gray100};
    }
    &:active, :hover {
        background-color: ${Colors.Gray200};
        border: 1px solid ${Colors.Gray300};
    }

    @media screen and (max-width: 480px) {
        width: 100%;
        margin-bottom: .5em;
    }
`
const ButtonIcon = styled.span`
    display: flex;
    margin: auto;
    position: relative;
    bottom: 1px;
    padding: 0 .5em;
    font-size: 1rem;

    @media screen and (max-width: 480px) {
        margin: auto 0;
        min-width: 2em;
    }
`
const ButtonText = styled.span`
    display: flex;
    margin: auto;
    padding: 0 .5em;

    @media screen and (max-width: 480px) {
        margin: ${props => props.center ? "auto " : "auto auto auto 0"};
    }
`

export const PanelButton = ({ type, onClick, icon, flex, children, disabled }) => {
    return (
        <>
            <ButtonContainer type={type} onClick={onClick} disabled={disabled} flex={flex}>
                {icon ? <ButtonIcon><FontAwesomeIcon icon={icon} /></ButtonIcon> : null}
                <ButtonText center={icon ? false : true}>{children}</ButtonText>
            </ButtonContainer>
        </>
    )
}

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


export const CardContainer = styled.div`
    display: flex;
    flex-flow: row;
    flex: 1;
    overflow: hidden;
    margin-bottom: 1em;
    gap: .35em;
`
export const CardContainerIcon = styled.div`
    display: flex;
    margin: auto;
    width: 3em;
    text-align: center;
    align-items: middle;

    @media screen and (max-width: 480px) {
        display: flex;
        margin: .75em 0 auto 0;
        align-items: middle;
    }
`
export const CardContainerInnerIcon = styled.div`
    display: flex;
    margin: auto;
    font-size: 1em;
`
export const CardContainerText = styled.div`
    display: flex;
    flex-flow: column;
    position: relative;
    flex: ${props => props.flex ? props.flex : "1"};
    overflow: hidden;

    @media screen and (max-width: 480px) {
        flex-wrap: wrap;
        width: 100%;
        flex: 1;
        display: ${props => props.mobileHide ? "none" : ""};
    }
`
export const CardContainerInnerText = styled.div`
    font-family: ${props => props.console ? 'monospace' : 'inherit'};
    text-overflow: ellipsis;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
`
export const CardContainerInputWrapper = styled.div`
    display: flex;
    flex-flow: row;
    flex: 1;
    gap: 1em;
    flex-wrap: wrap;

    @media screen and (max-width: 480px) {
        flex-flow: column;
        display: flex;
        margin: auto;
    }
`
export const CardContainerInput = styled.input`
    &[type="text"], &[type="email"], &[type="date"] {
        position: relative;
        flex: 1;
        border: 0;
        border-bottom: 1px solid rgb(80,80,80);
        outline: none;
        padding: .15rem 0;
        margin-bottom: .15rem;
    }
    &:focus {
        border-bottom: 1px solid rgb(255,75,157);
    }
    &:disabled {
        background-color: inherit;
        color: rgb(130, 130, 130);
        border-bottom: 1px solid rgb(170,170,170)!important;
    }
`
export const CardContainerSelectInput = styled.select`
    position: relative;
    flex: 1;
    border: 0;
    border-bottom: 1px solid rgb(80,80,80);
    outline: none;
    padding: .15rem 0;
    margin-bottom: .15rem;
`
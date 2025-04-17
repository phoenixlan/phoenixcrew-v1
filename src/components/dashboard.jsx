import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";
import { Colors } from "../theme";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

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
    padding: 2em 0;
    border-bottom: ${props => props.border ? ".05rem solid rgb(235, 235, 235)" : "0"};
`
export const DashboardBarSelector = styled.div`
    display: flex;
    flex-flow: row;
    border-bottom: ${props => props.border ? ".05rem solid rgb(235, 235, 235)" : "0"};
    font-family: "Roboto";
    font-size: .85rem;
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
    border-bottom: ${props => props.active ? ".15rem solid rgb(255,170,210)" : ""};
    cursor: pointer;

    @media screen and (max-width: 480px) {
        display: ${props => props.mobileHide ? "none" : ""};
    }
`

export const DashboardSubtitle = styled.div`
    font-family: "Roboto";
    font-size: .85rem;
    font-weight: lighter;
    color: rgb(96, 94, 92);
    margin: 4px 0;
`

export const DashboardTitle = styled.div`
    font-family: "Roboto";
    font-size: 1.8rem;
    font-weight: lighter;
    color: black;
`

export const DashboardContent = styled.div`
    display: ${props => props.visible == undefined ? "flex" : props.visible ? "flex" : "none"};
    padding: ${props => props.nopadding ? "0" : "1.5rem 0"};
    flex-flow: column;
    row-gap: 3rem;
    padding: 2rem 0;
    font-family: "Roboto";
    font-size: .85rem;
`

export const InnerContainer = styled.div`    
    font-size: .85rem;
    width: 100%;
    display: ${props => props.visible == undefined ? "flex" : props.visible ? "flex!important" : "none!important"};
    flex-flow: column;
    flex: ${props => props.flex ? props.flex : "undefined"};
    margin-top: ${props => props.floattop ? "0" : "auto"};
    margin-bottom: ${props => props.extramargin ? "20px" : "auto"};
    border-bottom: ${props => props.border ? ".05rem solid rgb(235, 235, 235)" : "0"};
    align-items: ${props => props.alignItems ? props.alignItems : "left"};
    row-gap: ${props => props.rowgap ?  "2rem" : undefined};

    @media screen and (max-width: 480px) {
        display: ${props => props.mobileHide ? "none" : ""};
        width: 100%;
        height: min-content;
    }

    @media screen and (min-width: 480px) {
        display: ${props => props.desktopHide ? "none" : "flex"};
    }  
`

export const InnerContainerRow = styled.div`
    display: ${props => props.visible == undefined ? "flex" : props.visible ? "flex" : "none"};
    width: 100%;
    flex: ${props => props.flex ? props.flex : "undefined"};
    flex-flow: row;
    flex-wrap: ${props => props.nowrap ? "nowrap" : "wrap"};
    column-gap: 2rem;
    row-gap: ${props => props.norowgap ? undefined : "2rem"};
    /*padding-bottom: ${props => props.nopadding ? "0" : "20px"};*/
    border-bottom: ${props => props.border ? ".05rem solid rgb(235, 235, 235)" : "0"};
    line-height: 1.15rem;

    @media screen and (max-width: 480px) {
        display: ${props => props.mobileHide ? "none" : ""};
        flex-wrap: wrap;
        flex-flow: ${props => props.mobileFlow ? props.mobileFlow : "column"};
        width: 100%;
        row-gap: ${props => props.mobileNoGap ? "0" : ".8rem"};
        column-gap: ${props => props.mobileNoGap ? "0" : ".8rem"};
    }
`

export const InlineContainer = styled.div`
    display: flex;
    flex-flow: row;
    width: min-content;
    column-gap: 1rem;
`


export const RowBorder = styled.div`
    display: flex;
    border-left: 1px solid rgb(235, 235, 235);
    height: 100%;
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
    padding-bottom: ${props => props.nopadding ? "0" : "6px"};
    font-weight: 500;
    margin: 0;
`
export const InnerContainerTitle = styled.h3`    
    font-size: 1rem;
    font-weight: 400;
    margin: 0;
    padding-bottom: 1rem;
`
export const InnerContainerTitleS = styled.h5`    
    font-size: 14px;
    padding-bottom: ${props => props.nopadding ? "0" : "6px"};
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
    font-size: ${props => props.small ? ".65rem" : ".85rem"};
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
    column-gap: 1em;

    @media screen and (max-width: 480px) {
        margin-bottom: ${props => props.mobileNoMargin ? "0" : "inherit"};
        row-gap: 0;
        display: ${props => props.mobileHide ? "none" : ""};
    }

    ${props => props.disabled ? `
        opacity: 0.6;
        user-select: none;
        pointer-events: none;
    ` : null}
`

export const InputCheckbox = ({ label, value, onChange, disabled }, props) => {
    return (
        <>
            <InputContainer mobileNoMargin>
                <input type="checkbox" checked={value} onChange={onChange} disabled={disabled} {...props} />
                <InputLabel top="1px">{label}</InputLabel>
            </InputContainer>
        </>
    )
}

export const InputElementDescription = styled.span`
    font-size: .85rem;
`
export const FormContainer = styled.form`
    display: flex;
`

export const InputElement = styled.input`
    font-family: "Roboto";
    border: 0;
    padding: .3em 0;
    background-color: rgb(255, 255, 255);
    border-bottom: .05rem solid rgb(135, 135, 135);
    outline: none;

    &:focus {
        border-bottom: .05rem solid rgb(255,75,157);
    }
    &:disabled {
        user-select: none;
        cursor: not-allowed;
        background-color: inherit;
        color: rgb(130, 130, 130);
        border-bottom: .05rem solid rgb(170,170,170)!important;
    }

    &[type="checkbox"] {
        position: relative;
        bottom: .05rem;
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
    padding: .3em 0;
    border-bottom: .05rem solid rgb(135, 135, 135);
    outline: none;
    resize: vertical;
    min-height: ${props => props.height ? props.height : "150px"};

    &:focus {
        border-bottom: .05rem solid rgb(255,75,157);
    }
    &:disabled {
        background-color: inherit;
        color: rgb(130, 130, 130);
    }
`

export const InputSelect = styled.select`
    display: flex;
    flex: 1;
    font-family: "Roboto";
    border: 0;
    padding: .3em 0;
    border-bottom: ${props => props.noborder ? "0" : ".05rem solid rgb(135, 135, 135)"};
    background-color: rgb(255, 255, 255);
    outline: none;
    padding-inline: 0!important;

    &:focus {
        border-bottom: ${props => props.noborder ? "0" : ".05rem solid rgb(255,75,157)"};
    }
`

export const InputButton = styled.button`
    height: 2.5em;
    width: 100%;
`

const ButtonContainer = styled.button`
    display: flex;
    flex-flow: row;
    min-height: 2.1rem;
    width: ${props => props.fillWidth ? "100%" : "fit-content"};
    font-size: .85rem;
    padding: 0 1em;
    cursor: pointer;
    background-color: ${Colors.Pink100};
    flex: ${props => props.flex ? "1" : null};
    border: 0;
    border-bottom: .25rem solid ${Colors.Pink200};

    &[disabled], &[disabled]:active, &[disabled]:hover {
        cursor: not-allowed;
        background-color: ${Colors.Gray100};
        border-bottom: .25rem solid ${Colors.Gray200};
    }
    &:hover {
        background-color: ${Colors.Pink50};
        border-bottom: .25rem solid ${Colors.Pink100};
    }
    &:active {
        background-color: ${Colors.Pink200};
        border-bottom: 0 solid;
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
    bottom: .05em;
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

export const PanelButton = ({ type, onClick, icon, flex, fillWidth, children, disabled }) => {
    return (
        <>
            <ButtonContainer type={type} onClick={onClick} disabled={disabled} flex={flex} fillWidth={fillWidth}>
                {icon ? <ButtonIcon><FontAwesomeIcon icon={icon} /></ButtonIcon> : null}
                <ButtonText center={icon ? false : true}>{children}</ButtonText>
            </ButtonContainer>
        </>
    )
}

const IFrame = styled.iframe`
    border: .05rem solid rgb(235, 235, 235);
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
    margin: .6em auto auto auto;
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
    margin: auto;
    row-gap: .35em;

    ${props => props.disabled ? `
        opacity: 0.6;
        user-select: none;
        pointer-events: none;
    ` : null}

    @media screen and (max-width: 480px) {
        flex-wrap: wrap;
        width: 100%;
        flex: 1;
        display: ${props => props.mobileHide ? "none" : ""};
    }
`

export const CardContainerDescriptiveText = styled.span`
    display: flex;
    font-size: .75rem;
`

export const CardContainerInnerText = styled.div`
    font-family: ${props => props.console ? 'monospace' : 'inherit'};
    text-decoration: ${props => props.italic ? "italic" : undefined};
    text-overflow: ellipsis;
    width: 100%;
    overflow: hidden;
    white-space: ${props => props.nowrap ? "nowrap" : "initial"};
    line-height: 1.15rem;
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
    &[type="text"], &[type="email"], &[type="date"], &[type="datetime-local"], &[type="number"] {
        position: relative;
        flex: 1;
        border: 0;
        border-bottom: .05rem solid rgb(80,80,80);
        outline: none;
        padding: .15rem 0;
        margin-bottom: .15rem;
        background-color: white;
        width: 100%;
        user-select: inherit;
    }
    &:focus {
        border-bottom: .05rem solid rgb(255,75,157);
    }
    &:disabled {
        background-color: inherit;
        color: rgb(130, 130, 130);
        border-bottom: .05rem solid rgb(170,170,170)!important;
    }
`
export const CardContainerSelectInput = styled.select`
    position: relative;
    flex: 1;
    border: 0;
    border-bottom: .05rem solid rgb(80,80,80);
    outline: none;
    padding: .15rem 0;
    margin-bottom: .15rem;
    background-color: white;
    width: 100%;

    &:focus {
        border-bottom: .05rem solid rgb(255,75,157);
    }
    &:disabled {
        background-color: inherit;
        color: rgb(130, 130, 130);
        border-bottom: .05rem solid rgb(170,170,170)!important;
    }
`
export const SpanLink = styled.span`
    color: rgb(255,75,157);
    cursor: pointer;

    &:hover {
        color: rgb(255, 156, 192);
    }
    &:active, &:focus {
        color: rgb(255,75,157);
    }

    @media screen and (max-width: 480px) {
        display: ${props => props.mobileHide ? "none" : ""};
    }
`


/*

*/
export const DropdownCardContainer = styled.div`
    display: ${props => props.visible == undefined ? "flex" : props.visible ? "flex" : "none"};
    flex-flow: column;
    row-gap: .5rem;

    @media screen and (min-width: 480px) {
        display: ${props => props.desktopHide ? "none" : "flex"};
    }    
`
export const DropdownCardContent = styled.div`
    display: flex;
    flex-flow: column;
    flex-basis: ${props => props.dropdownState ? "1" : "0"};
    transition: .2s;
    overflow: hidden;
    row-gap: 1rem;
`
const LocalDropdownHeader = styled.div`
    display: flex;
    width: 100%;
    cursor: pointer;
`
const LocalDropdownHeaderTitleContainer = styled.div`
    display: flex;
    flex: 1;
`
const LocalDropdownHeaderButtonContainer = styled.div`
    display: flex;
    flex: 0;
`
const LocalDropdownHeaderTitle = styled.div`
    display: flex;
    font-family: "Roboto";
    font-size: 1rem;
    font-weight: lighter;
`

const LocalDropdownHeaderButton = styled.div`
    display: flex;
    font-size: 1rem;
`
export const DropdownCardHeader = ({ title, dropdownState, onClick }) => {
    return (
        <LocalDropdownHeader onClick={onClick}>
            <LocalDropdownHeaderTitleContainer>
                <LocalDropdownHeaderTitle>
                    {title}
                </LocalDropdownHeaderTitle>
            </LocalDropdownHeaderTitleContainer>
            <LocalDropdownHeaderButtonContainer>
                <LocalDropdownHeaderButton>
                    <FontAwesomeIcon icon={dropdownState ? faMinus : faPlus} />
                </LocalDropdownHeaderButton>
            </LocalDropdownHeaderButtonContainer>
        </LocalDropdownHeader>
    )
}

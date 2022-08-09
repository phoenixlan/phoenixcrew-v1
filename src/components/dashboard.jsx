import React from "react";
import styled from "styled-components";

/*
    HTML Input components
*/

export const DashboardBlock = styled.div`
    background: white;
    width: 980px;
    margin: auto;
    padding: 8px;
`

export const DashboardHeader = styled.div`
    padding: 20px 0;
    border-bottom: ${props => props.border ? "1px solid rgb(235, 235, 235)" : "0"};
`
export const DashboardBarSelector = styled.div`
    display: flex;
    flex-flow: row;
    border-bottom: ${props => props.border ? "1px solid rgb(235, 235, 235)" : "0"};
    font-family: "Segoe UI";
    font-size: 14px;
`
export const DashboardBarElement = styled.div`
    padding: 4px 0;
    margin-right: 24px;
    font-weight: ${props => props.active ? "600" : "400"};
    border-bottom: ${props => props.active ? "2px solid rgb(255,170,210)" : ""};
    cursor: pointer;
`




export const DashboardSubtitle = styled.div`
    font-family: "Segoe UI";
    font-size: 14px;
    font-weight: lighter;
    color: rgb(96, 94, 92);
    margin: 4px 0;
`

export const DashboardTitle = styled.div`
    font-family: "Segoe UI";
    font-size: 28px;
    font-weight: lighter;
    color: black;
`

export const DashboardContent = styled.div`
    display: ${props => props.visible == undefined ? "block" : props.visible ? "block" : "none"};
    padding: 20px 0;
    font-family: "Segoe UI";
    font-size: 14px;
`

export const InnerContainer = styled.div`    
    display: ${props => props.visible == undefined ? "flex" : props.visible ? "flex" : "none"};
    flex-flow: column;
    flex: ${props => props.flex ? props.flex : "undefined"};
    padding-bottom: 20px;
    border-bottom: ${props => props.border ? "1px solid rgb(235, 235, 235)" : "0"};
`
export const InnerContainerRow = styled.div`
    display: ${props => props.visible == undefined ? "flex" : props.visible ? "flex" : "none"};
    flex-flow: row;
    padding-bottom: 20px;
    border-bottom: ${props => props.border ? "1px solid rgb(235, 235, 235)" : "0"};
`
export const InnerContainerTitle = styled.div`    
    font-size: 16px;
    padding-bottom: 8px;
`
export const InnerContainerMini = styled.div`
    padding-bottom: 8px;
`


/*
    HTML Input components
*/
const StyledInput = styled.input`
    font-family: "Segoe UI";
    border: 0;
    padding: 4px 0;
    border-bottom: 1px solid rgb(135, 135, 135);
    margin-bottom: 16px;
    outline: none;

    &:focus {
        border-bottom: 1px solid rgb(255,75,157);
    }
`

const InputLabel = styled.span`
    position: relative;
    font-family: "Segoe UI";
    font-size: ${props => props.small ? "11px" : "14px"};
    bottom: ${props => props.bottom ? props.bottom : "0"};
    top: ${props => props.top ? props.top : "0"};
    margin: ${props => props.small ? "0" : "0 6px"};
`

const InputContainer = styled.span`
    display: flex;
    flex-flow: ${props => props.column ? "column" : "row"};
`

export const InputCheckbox = ({ label, value, onChange }) => {
    return (
        <>
            <InputContainer>
                <input type="checkbox" checked={value} onChange={onChange} />
                <InputLabel bottom="1px">{label}</InputLabel>
            </InputContainer>
        </>
    )
}
export const InputRadio = ({ label, value, onChange }) => {
    return (
        <>
            <InputContainer>
                <input type="radio" checked={value} onChange={onChange} />
                <InputLabel top="1px">{label}</InputLabel>
            </InputContainer>
        </>
    )
}
export const InputText = ({ children, label, value, onChange }) => {
    return (
        <>
            <InputContainer column>
                <InputLabel small>{label}</InputLabel>
                <StyledInput {...children} type="text" value={value} onChange={onChange} />
            </InputContainer>
        </>
    )
}
export const InputDate = ({ children, label, value, onChange }) => {
    return (
        <>
            <InputContainer column>
                <InputLabel small>{label}</InputLabel>
                <StyledInput {...children} type="datetime-local" value={value} onChange={onChange} />
            </InputContainer>
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

import styled from "styled-components"
import { Colors } from "../../../theme"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// Window related:
export const WindowRootContainer = styled.div`
    display: ${props => props.visible ? "flex" : "none"};
    position: absolute;
    width: 100%;
    height: fit-content;
    min-height: 100vh;
    z-index: 101;
`
export const WindowContainer = styled.div`
    position: relative;
    display: flex;
    margin: auto;
    width: ${props => props.size == 0 || !props.size ? "48em" : null};
    width: ${props => props.size == 1 ? "34em" : null};
    overflow: hidden;
    height: fit-content;
    background-color: white;
    border-bottom: 1px solid ${Colors.Gray300};
    box-shadow: 0 1px 5px ${Colors.Gray500};
    z-index: 102;

    @media (max-width:48em) {
    }
`
export const WindowContentContainer = styled.div`
    display: flex;
    flex: 1;
    padding: ${props => props.size == 0 ? "0 0 0 2em" : "0 2em"};
    

    @media (max-width:48em) {
        flex-flow: column;
        padding: 0 2em;
    }
`

export const WindowContentHeaderContainer = styled.div`
    display: flex;
    width: ${props => props.size == 0 || !props.size ? "15em" : null};
    width: ${props => props.size == 1 ? "16em" : null};
    padding: 1em 0;
    border-bottom: ${props => props.bottomBorder ? "1px solid " + Colors.Gray300 : null};

    @media (min-width: 480px) and (max-width: 48em) {
        margin: auto;
        width: 100%;
        flex: 1;
    }
    
    @media screen and (max-width: 480px) {
        margin: auto 0;
        width: 100%;
        flex: 1;
        order: 1;
    }
`
    export const WindowContentTitleContainer = styled.div`
        display: flex;
        flex-flow: column;
    `
        export const WindowTitle = styled.h1`
            display: ${props => props.visible ? "flex" : "none"};
            font-size: 1.4em;
            font-weight: 400;
            margin: .15em 0;
        `
        export const WindowSubtitle = styled.h4`
            display: ${props => props.visible ? "flex" : "none"};
            font-size: 0.8em;
            font-weight: 400;
            margin: .15em 0;
        `

export const WindowContentBodyContainer = styled.div`
    display: flex;
    padding: 1em 0;
    width: ${props => props.size == 0 || !props.size ? "28em" : null};
    width: ${props => props.size == 1 ? "15em" : null};

    margin: auto;

    @media (max-width:48em) {
        margin: auto;
        width: 100%;
        flex: 1;
        order: 3;
    }
`

export const WindowExitButtonContainer = styled.div`
    display: ${props => props.size == 0 ? "flex" : "none"};
    width: 3em;
    padding: 1em 0;
    margn: 0 auto;
    order: 1;

    
    @media screen and (max-width: 48em) {
        position: absolute;
        top: .15em;
        right: 1em;
    }
`
    export const ExitButton = styled(FontAwesomeIcon)`
        margin-top: .2em;
        cursor: pointer;
        font-size: 1.2em;
        width: 100%;
    `



// Dashboard related:
export const DashboardRootContainer = styled.div`
    display: flex;
    flex-flow: row;
    filter: ${props => props.blurred ? "blur(8px)" : "blur(0)"};
    transition: .15s;
    z-index: 99;

    width: 100%;
    height: 100%;

    @media screen and (max-width: 480px) {
        width: unset;
        padding: 8px;
    }
`



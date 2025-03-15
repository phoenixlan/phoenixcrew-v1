import { faCheck, faExclamation, faInfo, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"


const types = {
    error: { icon: faXmark, primary: "#c2185b", secondary: "#fce4ec"},
    warning: { icon: faExclamation, primary: "#f57c00", secondary: "#fff3e0"},
    success: { icon: faCheck, primary: "#388e3c", secondary: "#e8f5e9"},
    info: { icon: faInfo, primary: "#0288d1", secondary: "#e1f5fe"},
    default: { icon: null, primary: "#616161", secondary: "#f5f5f5"}
}

const S = {
    RootContainer: styled.div`
        display: ${props => props.visible ? "flex" : "none"};
        flex-flow: row;
        min-height: 2rem;
        flex: 1;
        font-size: .85rem;
        padding: .5em 1em;
        background-color: ${props => props.secondary};
        border: 1px solid ${props => props.primary};
        color: ${props => props.primary};
    `,
        IconContainer: styled.div`
            display: flex;
            min-width: 1em;
            margin: auto 1.25em auto .25em;
        `,
            Icon: styled.span`
                font-size: 1rem;
                margin: 2px auto auto auto;
            `,
        TextContainer: styled.div`
            display: flex;
            flex-flow: column;
            flex: 1 1;
            margin: auto;
        `,

}

export const Notice = (props) => {
    return ( 
        <>
            <S.RootContainer primary={types[props.type]?.primary || types['default'].primary} secondary={types[props.type]?.secondary || types['default'].secondary} visible={props.visible} fillWidth={props.fillWidth}>
                <S.IconContainer hide={props.hideIcon}>
                    <S.Icon>
                        <FontAwesomeIcon icon={types[props.type]?.icon || types['default'].icon} />
                    </S.Icon>
                </S.IconContainer>
                <S.TextContainer>
                    {props.children || props.description}
                </S.TextContainer>
            </S.RootContainer>
        </>
    )
}
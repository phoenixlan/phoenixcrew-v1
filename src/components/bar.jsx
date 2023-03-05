import React, {useState} from 'react';
import styled from 'styled-components';

const colors = {
    red:    {background: "#EF5350", border: "#B71C1C"},
    orange: {background: "#FFA726", border: "#E65100"},
    yellow: {background: "#FFEE58", border: "#F57F17"},
    green:  {background: "#66BB6A", border: "#1B5E20"},
    aqua:   {background: "#26C6DA", border: "#006064"},
    blue:   {background: "#42A5F5", border: "#0D47A1"},
    violet: {background: "#7E57C2", border: "#311B92"},
    magenta:{background: "#AB47BC", border: "#4A148C"},
    pink:   {background: "#EC407A", border: "#880E4F"},
    gray:   {background: "rgb(235, 235, 235)", border: "rgb(215, 215, 215)"}
}

const S = {
    FlexBarRootContainer: styled.div`
        flex-flow: row;
        display: flex;
        width: 100%;
        height: 2em;
    `,

    ElementRootContainer: styled.div`
        background-color: ${props => colors[props.color]?.background || colors["gray"].background};
        border-bottom: .225em solid ${props => colors[props.color]?.border || colors["gray"].border};
        flex: ${props => props.width};
    
        &:hover & ToolTip {
            background-color: red;
        }
    `,

    ToolTipRoot: styled.div`
        display: ${props => props.visible ? "block" : "none"};
        position: relative;
        z-index: 1000;
    `,
        ToolTipContainer: styled.div`
            display: block;
            position: absolute;
            top: 2.5em;
            width: max-content;
            padding: .5em 2em;
            margin: 0 auto;
            background-color: rgb(235, 235, 235);
            border: 1px solid rgb(215, 215, 215);
            text-align: left;
            white-space: pre;
            z-index: 1000;

            @media screen and (max-width: 480px) {
            }
        `,
        ToolTipArrow: styled.div`
            height: 0!important;
            width: 0!important;
            position: absolute;
            left: .1em;
            top: 2.4em;
            border-color: transparent transparent rgb(235, 235, 235) rgb(235, 235, 235);
            border-width: .5em;
            border-style: solid;
            z-index: 1000;
        `,
            ToolTipText: styled.span`
            `
}

export const BarElement = (props) => {
    const [ toolTipState, setToolTipState ] = useState(false);

    const color = props.color;
    const width = props.width;
    const tooltip = props.tooltip;



    return (
        <>
            <S.ElementRootContainer color={color} width={width} onMouseEnter={() => setToolTipState(true)} onMouseLeave={() => setToolTipState(false)}>
                <S.ToolTipRoot visible={toolTipState}>
                    <S.ToolTipContainer>
                        <S.ToolTipText>
                            {tooltip}
                        </S.ToolTipText>
                    </S.ToolTipContainer>
                </S.ToolTipRoot>
            </S.ElementRootContainer>
        </>
    )
}

export const FlexBar = ({children}) => {

    return (
        <>
            <S.FlexBarRootContainer>
                {children}
            </S.FlexBarRootContainer>
        </>
    )
}
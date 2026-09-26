import React from 'react';
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

    stripedGreen: {background: "repeating-linear-gradient(-45deg, #43A047, #43a047 5px, #66BB6A 5px, #66BB6A 10px)", border: "#1B5E20"},
    stripedOrange:{background: "repeating-linear-gradient(-45deg, #FFCC80, #FFCC80 5px, #FFA726 5px, #FFA726 10px)", border: "#E65100"},

    gray:   {background: "rgb(235, 235, 235)", border: "rgb(215, 215, 215)"}
}

const S = {
    FlexBarRootContainer: styled.div`
        flex-flow: column;
        display: flex;
        width: 100%;
        
    `,
    BarElementContainer: styled.div`
        display: flex;
        width: 100%;
        height: 2em;
    `,
    BarTitle: styled.span`
        font-weight: 600;
        margin-bottom: .35rem;
    `,
    BarLegendContainer: styled.div`
        display: flex;
        flex-flow: column;
        margin: .35rem 0 1em 0;
        gap: .35rem;
    `,
    LegendEntry: styled.div`
        display: flex;
        flex-flow: row;
        gap: 1em;
        align-items: center;
    `,
    LegendColorIcon: styled.div`
        border: 1px solid ${props => colors[props.color]?.border || colors["gray"].border};
        background: ${props => colors[props.color]?.background || colors["gray"].background};
        width: 1rem;
        height: 1rem;
    `,

    ElementRootContainer: styled.div`
        background: ${props => colors[props.color]?.background || colors["gray"].background};
        border-bottom: .225em solid ${props => colors[props.color]?.border || colors["gray"].border};
        flex: ${props => props.fillOnEmpty ? (props.width == 0 ? "1" : props.width) : props.width};
    
        &:hover & ToolTip {
            background-color: red;
        }
    `,
}

export const BarElement = (props) => {
    const color = props.color;
    const count = props.count;
    const title = props.title;
    const fillOnEmpty = props.fillOnEmpty;
    
    return (
        <>
            <S.ElementRootContainer color={color} width={count} title={title} fillOnEmpty={fillOnEmpty} />
        </>
    )
}

// legend is a list of { color, text } shown with a color box under the bar
export const FlexBar = ({title, legend = [], children}) => {
    return (
        <>
            <S.FlexBarRootContainer>
                {title ? <S.BarTitle>{title}</S.BarTitle> : null}
                <S.BarElementContainer>
                    {children}
                </S.BarElementContainer>
                <S.BarLegendContainer>
                    {legend.map((entry) => (
                        <S.LegendEntry key={entry.text}>
                            <S.LegendColorIcon color={entry.color} />
                            <span>{entry.text}</span>
                        </S.LegendEntry>
                    ))}
                </S.BarLegendContainer>
            </S.FlexBarRootContainer>
        </>
    )
}
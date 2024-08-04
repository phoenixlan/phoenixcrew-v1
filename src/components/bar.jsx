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
    BarElementInfoContainer: styled.div`
        display: flex;
        flex-flow: column;
        margin: 1em 0;
        width: 100%;
        gap: .1em;
    `,
    InfoContainer: styled.div`
        display: flex;
        flex-flow: row;
        height: max-content;
        gap: 1em;
    `,
    BarElementColorIcon: styled.div`
        border: 1px solid ${props => colors[props.color]?.border || colors["gray"].border};
        background: ${props => colors[props.color]?.background || colors["gray"].background};
        width: 1em;
        height: 1em;
    `,
    BarElementInfoTitle: styled.span`
        font-size: 1em;
    `,

    ElementRootContainer: styled.div`
        background: ${props => colors[props.color]?.background || colors["gray"].background};
        border-bottom: .225em solid ${props => colors[props.color]?.border || colors["gray"].border};
        flex: ${props => props.width};
    
        &:hover & ToolTip {
            background-color: red;
        }
    `,
}

export const BarElement = (props) => {
    const color = props.color;
    const width = props.width;
    const title = props.title;
    
    return (
        <>
            <S.ElementRootContainer color={color} width={width} title={title} />
        </>
    )
}

export const FlexBar = ({children}) => {
    return (
        <>
            <S.FlexBarRootContainer>
                <S.BarElementContainer>
                    {children}
                </S.BarElementContainer>
                <S.BarElementInfoContainer>
                    {
                        children.filter(element => element.props.title && element.props.width).map((element) => {
                            return (
                                <S.InfoContainer>
                                    <S.BarElementColorIcon color={element.props.color} />
                                    <S.BarElementInfoTitle>
                                        {element.props.title}
                                    </S.BarElementInfoTitle>
                                </S.InfoContainer>
                            )
                        })
                    }
                </S.BarElementInfoContainer>
            </S.FlexBarRootContainer>
        </>
    )
}
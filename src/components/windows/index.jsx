import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"

const S = {
    RootContainer: styled.div`
        position: absolute;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 100000;
        display: flex;
    `,

    WindowFill: styled.div`
        position: absolute;
        width: 100vw;
        height: 100vh;
        opacity: .5;
        background-color: rgb(0 0 0);
        z-index: 100;
        user-select: none;
    `,

    WindowContainer: styled.div`
        margin: auto;
        position: relative;
        width: 30em;
        height: fit-content;
        background-color: white;
        z-index: 1000;
        padding: 0 1.5em;
    `,

    Line: styled.hr `
        border: 0;
        border-bottom: 1px solid rgb(235,235,235);
        margin: 0;
    `,

    HeaderContainer: styled.div`
        padding: 1.2em 0;
        display: flex;
        flex-flow: column;
    `,
        TitleExitContainer: styled.div`
            display: flex;
            flex-flow: row;
        `,
            WindowTitle: styled.h1`
                font-size: 1.1rem;
                font-weight: 300;
                margin: .2em 0;
                flex: 1 100%;
            `,
            WindowSubtitle: styled.h2`
                font-size: .75em;
                font-weight: 200;
                margin: .2em 0;
            `,

            ExitContainer: styled.div`
                position: relative;
                margin: auto;
            `,
            ExitButton: styled(FontAwesomeIcon)`
                cursor: pointer;
                font-size: 1rem;
            `,

    ContentContainer: styled.div`
        padding: 1.2em 0 0 0;
    `,
}

export const newWindow = ({title, subtitle, Component, exitFunction, entries}) => {
    return (
        <>
            <S.RootContainer>
                <S.WindowFill />
                <S.WindowContainer>
                    <S.HeaderContainer>
                        <S.TitleExitContainer>
                            <S.WindowTitle>
                                {title}
                            </S.WindowTitle>
                            <S.ExitContainer>
                                <S.ExitButton onClick={exitFunction} icon={faXmark}></S.ExitButton>
                            </S.ExitContainer>
                        </S.TitleExitContainer>
                        <S.WindowSubtitle hidden={!subtitle}>
                            {subtitle}
                        </S.WindowSubtitle>
                    </S.HeaderContainer>

                    <S.Line />

                    <S.ContentContainer>
                        <Component entries={entries} functions={{exitFunction}} />
                    </S.ContentContainer>
                </S.WindowContainer>
            </S.RootContainer>
        </>
    )
}
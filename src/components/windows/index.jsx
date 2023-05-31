import styled from "styled-components"

const S = {
    RootContainer: styled.div`
        position: absolute;
        left: 0;
        top: 0;
        width: 100vw;
        height: 80vh;
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
        flex-flow: row;
    `,
        TitleContainer: styled.div`
            display: flex;
            flex-flow: column;
            flex: 1;
        `,
            ContainerTitle: styled.h1`
                font-size: 1.1em;
                font-weight: 300;
                margin: .2em 0;
            `,
            ContainerSubTitle: styled.h2`
                font-size: .75em;
                font-weight: 200;
                margin: .2em 0;
            `,
        ExitContainer: styled.div`
            display: flex;
            flex: 0 0 fit-content;
        `,
            ExitButton: styled.span`
            `,

    ContentContainer: styled.div`
        padding: 1.2em 0 0 0;
    `,

    ActionContainer: styled.div`
    `
}

export const newWindow = ({title, subtitle, Component, exitFunction, entries}) => {
    return (
        <>
            <S.RootContainer>
                <S.WindowFill />
                <S.WindowContainer>
                    <S.HeaderContainer>
                        <S.TitleContainer>
                            <S.ContainerTitle>
                                {title}
                            </S.ContainerTitle>
                            {subtitle
                            ?
                                <S.ContainerSubTitle>
                                    {subtitle}
                                </S.ContainerSubTitle>
                            :
                                null
                            }
                        </S.TitleContainer>
                        <S.ExitContainer>
                            <S.ExitButton onClick={exitFunction}>
                                (Close)
                            </S.ExitButton>
                        </S.ExitContainer>
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
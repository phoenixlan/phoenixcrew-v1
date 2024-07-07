import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"
import { Colors } from "../../theme"
import React, { useContext, useEffect } from "react"
import { useState } from "react"
import { DashboardRootContainer, ExitButton, WindowContainer, WindowContentBodyContainer, WindowContentContainer, WindowContentHeaderContainer, WindowContentTitleContainer, WindowExitButtonContainer, WindowRootContainer, WindowSubtitle, WindowTitle } from "./build"



export const WindowManagerContext = React.createContext({});

const WindowConstructor = ({data}) => {

    // Inherit WindowManagerContext
    const windowManager = useContext(WindowManagerContext);

    useEffect(() => {
        // Create keydown EventListener and a function to exit current window when "Escape" has been pressed.
        document.addEventListener("keydown", EscapeWindow);
        function EscapeWindow(e) {
            if(e.code === "Escape") {
                windowManager.exitWindow();
                data.exitFunctions();
            }
        }
    }, [])

    // Create a React component from data.component
    const Component = data.component;

    return (
        <>
            <WindowContainer size={data.size}>
                <WindowContentContainer size={data.size}>
                    <WindowContentHeaderContainer bottomBorder={Component}>
                        <WindowContentTitleContainer>
                            <WindowTitle visible={data.title}>{data.title}</WindowTitle>
                            <WindowSubtitle visible={data.subtitle}>{data.subtitle}</WindowSubtitle>
                        </WindowContentTitleContainer>
                    </WindowContentHeaderContainer>
                    <WindowContentBodyContainer size={data.size}>
                        {Component ? <Component entries={data.entries} /> : undefined}
                    </WindowContentBodyContainer>
                    <WindowExitButtonContainer size={data.size}>
                        <ExitButton onClick={windowManager.exitWindow} icon={faXmark} />
                    </WindowExitButtonContainer>
                </WindowContentContainer>
            </WindowContainer>
        </>
    )
}



export const WindowManager = (props) => {
    const [ window, setWindow ] = useState(null);

    // Function available within the context provider to create a new window and blur the background
    function newWindow(data) {
        setWindow(<WindowConstructor data={data} />)
    }

    // Function available within the context provider to exit current window.
    function exitWindow() {
        setWindow(false);
    }

    return (
        <>
            <WindowManagerContext.Provider value={{newWindow, exitWindow}} >
                <WindowRootContainer visible={window}>
                    {window}
                </WindowRootContainer>
                <DashboardRootContainer blurred={window}>
                    {props.children}
                </DashboardRootContainer>
            </WindowManagerContext.Provider>
        </>
    )
}
import React , { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { Crew, getCurrentEvent, getEvents } from "@phoenixlan/phoenix.js";

import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputElement, InputLabel, InputTextArea, InputSelect, InnerContainerTitleS } from "../../../components/dashboard";
import { PageLoading } from "../../../components/pageLoading"

import { CrewViewMemberViewer } from "./memberViewer";
import { CrewViewCrewCard } from "./crewCard";

export const ViewCrew = () => {
    const { uuid } = useParams();
    const [ activeContent, setActiveContent ] = useState(1);
    const [ loading, setLoading ] = useState(true);
    const [ crew, setCrew ] = useState();

    useEffect(async () => {
        try {
            const crew = await Crew.getCrew(uuid);
            setCrew(crew);
            setLoading(false);
        } catch(e) {
            return (
                <p>En feil oppsto</p>
            )
        }
        
    }, []);

    if(loading) {
        return (
            <PageLoading />
        )
    }
    else {
        return (
            <>
                <DashboardHeader>
                    <DashboardTitle>
                        Crew
                    </DashboardTitle>
                    <DashboardSubtitle>
                        {crew.name}
                    </DashboardSubtitle>
                </DashboardHeader>

                <DashboardBarSelector border>
                    <DashboardBarElement active={activeContent == 1} onClick={() => setActiveContent(1)}>Generelt</DashboardBarElement>
                    <DashboardBarElement active={activeContent == 2} onClick={() => setActiveContent(2)}>Medlemmer</DashboardBarElement>
                    <DashboardBarElement active={activeContent == 3} onClick={() => setActiveContent(3)}>Crew-kort</DashboardBarElement>
                </DashboardBarSelector>

                <DashboardContent visible={activeContent == 1}>
                    <InnerContainer>
                        <form>
                            <InnerContainerRow>
                                <InnerContainer flex="1">
                                    <InputContainer column extramargin>
                                        <InputLabel small>Navn</InputLabel>
                                        <InputElement type="text" value={crew.name} disabled />
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Beskrivelse</InputLabel>
                                        <InputTextArea type="text" value={crew.description} disabled />
                                    </InputContainer>
                                </InnerContainer>
                                <InnerContainer flex="1" />
                            </InnerContainerRow>
                        </form>
                    </InnerContainer>
                </DashboardContent>

                <DashboardContent visible={activeContent == 2}>
                    <CrewViewMemberViewer crew={crew} />
                </DashboardContent>
                <DashboardContent visible={activeContent == 3}>
                    <CrewViewCrewCard crew={crew} />
                </DashboardContent>
            </>
        )
    }
}
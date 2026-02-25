import React , { useState } from "react";

import { useParams } from "react-router-dom";

import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InputContainer, InputElement, InputLabel, InputTextArea } from "../../../components/dashboard";
import { PageLoading } from "../../../components/pageLoading"

import { CrewViewMemberViewer } from "./memberViewer";
import { CrewViewCrewCard } from "./crewCard";
import { useCrew } from "../../../hooks/useCrew";

export const ViewCrew = () => {
    const { uuid } = useParams();
    const [ activeContent, setActiveContent ] = useState(1);

    const { data: crew, isLoading } = useCrew(uuid);

    if(isLoading) {
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

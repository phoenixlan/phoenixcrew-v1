import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Crew } from "@phoenixlan/phoenix.js";
import { DashboardContent, InnerContainer, InnerContainerRow, InnerContainerTitle } from "../../components/dashboard";

import { PageLoading } from "../../components/pageLoading"
import { UserCard } from "../../components/userCard"
import { Button } from "../../components/button"

import { Theme } from "../../theme";
import { useCurrentEvent } from '../../hooks/useEvent';
import { useQuery, useQueryClient } from 'react-query';

const S = {
    ButtonContainer: styled.div`
        display: flex;
        flex-direction: row;

    `,
    Avatar: styled.img`
    width: 100%;`,
    textarea: styled.textarea`
        width: 100%;
        height: 10em;
    `
}
const AnswerApplication = (props) => {
    const [answer, setAnswer] = useState("");

    const accept = async (crew_uuid) => {
        if(window.confirm("Er du sikker på at du vil godkjenne?")) {
            await Crew.Applications.answerApplication(props.application.uuid, crew_uuid, answer, 2)
            await props.reload();
        }
    }

    const reject = async () => {
        if(window.confirm("Er du sikker på at du vil avslå?")) {
            await Crew.Applications.answerApplication(props.application.uuid, null, answer, 3)
            await props.reload();
        }
    }

    const onAnswerUpdate =  (event) => {
        setAnswer(event.target.value)
    }

    return (<InnerContainer>
        <InnerContainerTitle>Svar</InnerContainerTitle>
        <InnerContainerRow nowrap>
                <S.textarea value={answer} onChange={onAnswerUpdate}/>
        </InnerContainerRow>
        <S.ButtonContainer>
            {
                props.application.crews.map((crew_mapping) => (
                    <Button color={crew_mapping.accepted ? Theme.Disabled : Theme.Accept} onClick={crew_mapping.accepted ? (() => {}) : (() => accept(crew_mapping.crew.uuid))}>Godkjenn til {crew_mapping.crew.name}</Button>
                ))
            }
            {
                props.application.state === "ApplicationState.created" ? (
                    <Button color={Theme.Cancel} onClick={reject}>Avslå</Button>
                ) : null
            }
        </S.ButtonContainer>
    </InnerContainer>)
}

export const ViewApplication = (props) => {
    const { uuid } = useParams();
    const queryClient = useQueryClient();

    const { data: currentEvent } = useCurrentEvent();

    const { data: application, isLoading } = useQuery(
        ['application', uuid],
        () => Crew.Applications.getApplication(uuid),
        { enabled: !!uuid }
    );

    const reload = async () => {
        queryClient.invalidateQueries(['application', uuid]);
        queryClient.invalidateQueries(['crewApplications']);
    }

    const hide = async () => {
        if(window.confirm("Er du sikker på at du vil skjule søknaden?")) {
            await Crew.Applications.hideApplication(uuid);
            await reload();
        }
    }

    if(isLoading) {
        return (<PageLoading />)
    }

    return (<>
        <DashboardContent>
            <InnerContainerRow mobileFlow="column-reverse">
                <InnerContainer flex="2">
                    <InnerContainerTitle>Crew</InnerContainerTitle>
                    <InnerContainerRow>
                    {
                        application.crews.map((crew_mapping) => (
                            <InnerContainerRow key={crew_mapping.uuid}>
                                <p>{crew_mapping.crew.name} {crew_mapping.accepted && (<b>Godkjent!</b>) }</p>
                            </InnerContainerRow>
                        ))
                    }
                    </InnerContainerRow>
                    <InnerContainerTitle>Søknadstekst</InnerContainerTitle>
                    <InnerContainerRow>
                        <div>
                            <code>
                                {
                                    application.contents.split("\n").map((line) => (<p>{line}</p>))
                                }
                            </code>
                        </div>
                    </InnerContainerRow>
                    {
                        application.hidden ? (
                            <>
                                <InnerContainerTitle>Skjult søknad</InnerContainerTitle>
                                <InnerContainerRow>
                                    <p>Søknaden er skjult av en administrator.</p>
                                </InnerContainerRow>
                            </>
                        ) :
                        (
                            currentEvent && application.event.uuid == currentEvent.uuid ? (<>
                                {application.state !== "ApplicationState.rejected" && (
                                    <AnswerApplication application={application} reload={reload} />
                                )}

                                {application.state !== "ApplicationState.created" && (
                                    <InnerContainer>
                                        <InnerContainerTitle>Svar: {application.state === "ApplicationState.accepted" ? "Godkjent" : "Avslått"}</InnerContainerTitle>
                                        <p>Behandlet av: <b>{
                                        application.last_processed_by ?
                                            `${application.last_processed_by.firstname} ${application.last_processed_by.lastname}` :
                                            "Ingen"
                                        }</b></p>
                                        <i>{application.answer}</i>
                                    </InnerContainer>
                                )}

                                <InnerContainer>
                                    <InnerContainerTitle>Skjul søknaden fra søkeren?</InnerContainerTitle>
                                    <Button color={Theme.Cancel} onClick={hide}>Skjul</Button>
                                </InnerContainer>

                            </>) : (
                                <InnerContainerRow>
                                    <p><i>NB: Denne søknaden er fra et annet arrangement, så du kan ikke godta/avslå.</i></p>
                                </InnerContainerRow>
                            )
                        )
                    }
                </InnerContainer>
                <InnerContainer flex="1">
                    <UserCard user={application.user} />
                </InnerContainer>

            </InnerContainerRow>

        </DashboardContent>
    </>)
};

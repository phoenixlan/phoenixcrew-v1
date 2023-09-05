import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Crew, getCurrentEvent } from "@phoenixlan/phoenix.js";
import { DashboardBarElement, DashboardBarSelector, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputCheckbox, InputContainer, InputElement, InputLabel, InputSelect, LabelWarning } from "../../components/dashboard";

import { PageContainer } from "../../components/blocks"

import { PageLoading } from "../../components/pageLoading"
import { UserCard } from "../../components/userCard"
import { Button } from "../../components/button"

import { Theme } from "../../theme";

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
    const [application, setApplication] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ currentEvent, setCurrentEvent ] = useState();

    const reload = async () => {
        setLoading(true);
        const [ application, currentEvent ] = await Promise.all([
            Crew.Applications.getApplication(uuid),
            getCurrentEvent()
        ])
        if(application) {
            console.log("Fetched application:")
            console.log(application);

            setApplication(application)
            setCurrentEvent(currentEvent)
            setLoading(false);

        } else {
            console.log("Fuck");
        }
    }

    useEffect(() => {
        reload().catch(e => {
            console.log(e);
        })
    }, []);

    const hide = async () => {
        if(window.confirm("Er du sikker på at du vil skjule søknaden?")) {
            await Crew.Applications.hideApplication(uuid);
            await reload();
        }
    }



    if(loading) {
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
                            <InnerContainerRow>
                                <p>{crew_mapping.crew.name} {crew_mapping.accepted ? (<b>Godkjent!</b>) : null}</p>
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
                            application.event.uuid == currentEvent.uuid ? (<>
                                {application.state !== "ApplicationState.rejected" ? (
                                    <AnswerApplication application={application} reload={reload} />
                                ) : null}

                                {application.state !== "ApplicationState.created" ? (
                                    <InnerContainer>
                                        <InnerContainerTitle>Svar: {application.state === "ApplicationState.accepted" ? "Godkjent" : "Avslått"}</InnerContainerTitle>
                                        <p>Behandlet av: <b>{
                                        application.last_processed_by ? 
                                            `${application.last_processed_by.firstname} ${application.last_processed_by.lastname}` : 
                                            "Ingen"
                                        }</b></p>
                                        <i>{application.answer}</i>
                                    </InnerContainer>
                                ) : null}

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
    //TODO not quite right, backend har ikke application state enda
    /*
    return (<PageContainer>
        <UserCard user={application.user} />
        <h1>Crew</h1>
        <ol>
            {
                application.crews.map((crew_mapping) => (<li>{crew_mapping.crew.name} {crew_mapping.accepted ? (<b>Godkjent!</b>) : null}</li>))
            }
        </ol>
        <h1>Søknads-tekst</h1>
        <i>{application.contents}</i>

        {
            application.event.uuid == currentEvent.uuid ? (<>
                {application.state !== "ApplicationState.rejected" ? (
                    <AnswerApplication application={application} reload={reload} />
                ) : null}

                {application.state !== "ApplicationState.created" ? (
                    <>
                        <h2>Svar: {application.state === "ApplicationState.accepted" ? "Godkjent" : "Avslått"}</h2>
                        <p>Behandlet av: <b>{
                        application.last_processed_by ? 
                            `${application.last_processed_by.firstname} ${application.last_processed_by.lastname}` : 
                            "Ingen"
                        }</b></p>
                        <i>{application.answer}</i>
                    </>
                ) : null}

                <Button color={Theme.Cancel} onClick={hide}>Skjul</Button>
            </>) : (<p><i>NB: Denne søknaden er fra et annet arrangement, så du kan ikke godta/avslå.</i></p>)
        }
    </PageContainer>)
    */
};
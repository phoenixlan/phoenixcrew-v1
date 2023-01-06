import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Crew } from "@phoenixlan/phoenix.js";

import { PageContainer } from "../../components/blocks"

import { PageLoading } from "../../components/pageLoading"
import { UserCard } from "../../components/userCard"
import { Button } from "../../components/button"

import { Theme } from "../../theme";

const S = {
    ButtonContainer: styled.div`
        display: flex;
        flex-direction: row;
    
    `
}
const AnswerApplication = (props) => {
    const [answer, setAnswer] = useState("");

    const accept = async (crew_uuid) => {
        console.log("Accept")
        await Crew.Applications.answerApplication(props.application.uuid, crew_uuid, answer, 2)
        await props.reload();
    }

    const reject = async () => {
        console.log("deny")
        await Crew.Applications.answerApplication(props.application.uuid, null, answer, 3)
        await props.reload();
    }

    const onAnswerUpdate =  (event) => {
        setAnswer(event.target.value)
    }

    return (<>
        <div>
            <h1>Svar</h1>
            <textarea value={answer} onChange={onAnswerUpdate}/>
        </div>
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
    </>)
}

export const ViewApplication = (props) => {
    const { uuid } = useParams();
    const [application, setApplication] = useState([]);
    const [loading, setLoading] = useState(true);

    const reload = async () => {
        setLoading(true);
        const application = await Crew.Applications.getApplication(uuid)
        if(application) {
            console.log("Fetched application:")
            console.log(application);

            setApplication(application)
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


    if(loading) {
        return (<PageLoading />)
    }
    //TODO not quite right, backend har ikke application state enda
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
    </PageContainer>)
};
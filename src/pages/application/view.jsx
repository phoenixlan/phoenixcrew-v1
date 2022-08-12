import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { BASE_URL } from "../../"

import { User, Crew, Team } from "@phoenixlan/phoenix.js";

import { PageContainer } from "../../components/blocks"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight }  from '@fortawesome/free-solid-svg-icons'

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

    const accept = async () => {
        console.log("Accept")
        await Crew.Applications.answerApplication(props.uuid, answer, "accepted")
        await props.reload();
    }

    const reject = async () => {
        console.log("deny")
        await Crew.Applications.answerApplication(props.uuid, answer, "rejected")
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
            <Button color={Theme.Accept} onClick={accept}>Godkjenn</Button>
            <Button color={Theme.Cancel} onClick={reject}>Avslå</Button>
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
        <h1>Søknad til {application.crew.name}</h1>
        <i>{application.contents}</i>
        {application.state === "ApplicationState.created" ? (
            <AnswerApplication uuid={uuid} reload={reload} />
        ) : (
            <>
                <h2>Svar: {application.state === "ApplicationState.accepted" ? "Godkjent" : "Avslått"}</h2>
                <p>Behandlet av: <b>{
                application.last_processed_by ? 
                    `${application.last_processed_by.firstname} ${application.last_processed_by.lastname}` : 
                    "Ingen"
                }</b></p>
                <i>{application.answer}</i>
            </>
        )}
    </PageContainer>)
};
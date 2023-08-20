import React, { useState, useEffect } from "react";

import styled from "styled-components";

import MDEditor from '@uiw/react-md-editor';
import { Email } from "@phoenixlan/phoenix.js";

import { DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputLabel, InputSelect, InputElement } from "../../components/dashboard";
import { FormContainer, FormEntry, FormLabel, FormSelect, FormButton } from '../../components/form';
import { PageLoading } from "../../components/pageLoading";

const EditorWrapper = styled.div`
width: 100%;`

const MailOuter = styled.div`
    border: 1px solid;
`

const MailHeader = styled.div`
    font-size: 2em;
    border-bottom: 1px solid gray;
    padding: 0.5em;
`

const MailBody = styled.div`
    padding: 1em;
`

export const EmailForm = () => {
    const [ subject, setSubject ] = useState("")
    const [ body, setBody ] = useState("")
    const [ selectedGroup, setSelectedGroup ] = useState("crew_info")
    const [ targetCount, setTargetCount] = useState(1)

    const [ isLoadingPreview, setIsLoadingPreview ] = useState(false)
    const [ previewBody, setPreviewBody ] = useState("")
    const [ previewSubject, setPreviewSubject ] = useState("")
    const [ canSend, setCanSend ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const [ hasSent, setHasSent] = useState(false)

    const preview = async () => {
        setIsLoadingPreview(true);
        const resp = await Email.emailDryrun(selectedGroup, subject, body)

        setTargetCount(resp.count);

        setPreviewBody(body);
        setPreviewSubject(subject);
        setIsLoadingPreview(false);
        setCanSend(true);
    }
    
    const send = async () => {
        setLoading(true)
        const resp = await Email.sendEmails(selectedGroup, subject, body)
        setLoading(false)
        setHasSent(true)
    }

    const updateSelectedGroup = (e) => {
        setSelectedGroup(e.target.value)
    }

    const options = [
        { type: "event_notification", name: "Folk som vil vite om kommende LAN" },
        { type: "participant_info", name: "Deltakere" },
        { type: "crew_info", name: "Crew-medlemmer" }
    ]

    if(loading) {
        return (
            <PageLoading />
        )
    }

    if(hasSent) {
        return (
            <>
                <h1>Mailen er sendt</h1>
                <p>Du har sendt e-posten. Sjekk innboksen din om du vil se hvordan e-posten endte opp med å se ut</p>
            </>
        )
    }

    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Send e-post til bruekre
                </DashboardTitle>
                <DashboardSubtitle>
                    Her kan du sende e-post til brukere på siden på en trygg og lovlig måte. La oss ikke gjøre folk sure!
                </DashboardSubtitle>

            </DashboardHeader>

            <DashboardContent>
                <InnerContainer>
                    <InnerContainerTitle>
                        Om å sende e-post
                    </InnerContainerTitle>
                    <p>Å sende e-post er en fin måte å nå brukerne våres på(I den grad de leser e-postene de mottar). Du må dog passe på hva du sender. Merk følgende:</p>
                    <ul>
                        <li>Det er ulovlig å sende e-poster til folk som ikke har spurt om det</li>
                        <li>Det er ulovlig å sende e-poster til deltakere om den ikke er relevant til <i>tjenesten vi leverer til dem</i>, dvs arrangementet. Dersom det er <b>vi</b> som får nytte av e-posten og ikke våre deltakere, er den ulovlig å sende. Du kan f.eks sende en e-post og spørre hva slags konkurranser folk vil ha, men du kan ikke sende e-post og be folk kjøpe pizza(fordi det ikke er nødvendig å bli bedt om å kjøpe pizza for å delta på LAN)</li>
                        <li>Praktisk informasjon som gjør opplevelsen av LANet bedre(hva man burde ta med, do's and don'ts, etc, er lovlig. Dette er fordi deltakere har legitim nytte av å vite denne informasjonen</li>
                    </ul>
                    <p>Om du er usikker burde du antageligvis ikke sende mailen. Les <a href="https://www.datatilsynet.no/rettigheter-og-plikter/virksomhetenes-plikter/">her</a> for mer informasjon.</p>
                    
                </InnerContainer>
                
                <InnerContainer>
                    <InnerContainerTitle>
                        Skriv en e-post
                    </InnerContainerTitle>

                        <InnerContainer flex="1">
                            <InputContainer column extramargin>
                                <InputLabel small>Navn</InputLabel>
                                <InputElement type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
                            </InputContainer>
                            <InputContainer column extramargin>
                                <InputLabel small>Målgruppe</InputLabel>
                                <InputSelect value={selectedGroup} onChange={updateSelectedGroup}>
                                    {
                                        options.map(option => {
                                            return (<option key={option.type} value={option.type}>{option.name}</option >)
                                        })
                                    }
                                </InputSelect>
                            </InputContainer>
                            <EditorWrapper>
                                <MDEditor
                                    value={body}
                                    onChange={setBody}
                                />
                            </EditorWrapper>
                            <FormButton type="submit" onClick={() => preview()}>Forhåndsvis</FormButton>
                        </InnerContainer>
                        <InnerContainer flex="1" mobileHide />
                        <InnerContainer flex="1" mobileHide />
                </InnerContainer>

                <InnerContainer>
                    <InnerContainerTitle>
                        Forhåndsvisning
                    </InnerContainerTitle>
                    {
                        isLoadingPreview ? (
                            <PageLoading />
                        ) : ( 
                            canSend ? (
                                <>
                                <p>Mailen vil bli sendt til {targetCount} mennesker(inkl. deg)</p>
                                <MailOuter>
                                    <MailHeader>{previewSubject}</MailHeader>
                                    <MailBody>
                                        <MDEditor.Markdown source={previewBody} style={{ whiteSpace: 'pre-wrap' }} />
                                        <p><i>Denne e-posten ble sendt fordi <code>[sett inn grunn her]</code>. Kontakt oss for spørsmål</i></p>
                                    </MailBody>
                                </MailOuter>
                                <FormButton type="submit" onClick={() => send()}>Send e-post</FormButton>
                                </>
                            ) : (
                                <p><i>Du vil få informasjon om hvem som vil mottar mailen her etter at du trykker "forhåndsvis"</i></p>
                            )
                        )
                    }
                </InnerContainer>
            </DashboardContent>
        </>
    )
}
import { useState, useContext, useEffect } from 'react';
import { Agenda, getCurrentEvent } from "@phoenixlan/phoenix.js";
import { CardContainer, CardContainerDescriptiveText, CardContainerText, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputElement, InputLabel, PanelButton } from '../../../../components/dashboard';

import { AuthenticationContext } from '../../../../components/authentication';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useForm } from 'react-hook-form';
import { Notice } from '../../../../components/containers/notice';
import { PageLoading } from '../../../../components/pageLoading';

export const CreateAgendaEntry = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    let history = useHistory();

    // Import the following React contexts:
    const authContext = useContext(AuthenticationContext);
    const agendaManagement = authContext.roles.includes("admin" || "evemt_admin" || "info_admin" || "compo_admin");

    const [ title, setTitle ] = useState(null);
    const [ description, setDescription ] = useState(null);
    const [ location, setLocation ] = useState(null);
    const [ time, setTime ] = useState(null);
    const [ duration, setDuration ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    // States for error, used when attempting to create the position
    const [ error, setError ] = useState(false);

    const load = async () => {
        setLoading(false);
    }


    useEffect(() => {
        load();
    })

    const createAgendaEntry = async (data) => {
        const event = await getCurrentEvent();
        const datetimeUnixTime = new Date(data.time).getTime()/1000;
        const duration = Number(data.duration);

        try {
            let response = await Agenda.createAgendaEntry(event.uuid, data.title, data.description, data.location, datetimeUnixTime, duration, data.pinned);
            history.push('/information/schedule/' + response.uuid)
        } catch(e) {
            setError(e.message);
            console.error("An error occured while attempting to create the agenda entry.\n" + e);
        }
    }


    // Check if user has "admin" privilege and allow the user to view the create position page
    if(loading) {
        return(<PageLoading />)
    }
    if(agendaManagement) {
        return (
            <>
                <DashboardHeader border >
                    <DashboardTitle>
                        Opprett ny programpost
                    </DashboardTitle>
                    <DashboardSubtitle>
                        {title} 
                    </DashboardSubtitle>
                </DashboardHeader>
                <DashboardContent>
                    <InnerContainer rowgap>
                        <InnerContainerRow visible={error}>
                            {
                            <Notice fillWidth type="error" visible={error}>
                                Det oppsto en feil ved opprettelse av den nye stillingen.<br/>
                                {error}
                            </Notice>
                            }
                        </InnerContainerRow>

                        <InnerContainerRow>
                            <InnerContainer flex="1" floattop>
                                <InnerContainerTitle>Programinformasjon</InnerContainerTitle>

                                <InnerContainerRow nowrap>
                                    <CardContainer>
                                        <InputContainer column extramargin>
                                            <InputLabel small>Tittel</InputLabel>
                                            <InputElement {...register("title", {required: true})} type="text" value={title} placeholder="Eks. Minecraft: Battle Royale" onChange={(e) => setTitle(e.target.value)} />
                                        </InputContainer>
                                    </CardContainer>
                                </InnerContainerRow>

                                <InnerContainerRow nowrap>
                                    <CardContainer>
                                        <InputContainer column extramargin>
                                            <InputLabel small>Beskrivelse</InputLabel>
                                            <InputElement {...register("description")} type="text" value={description} placeholder="Eks. Runde 1 av 3 • FFA Konkurranse • Delta på battleroyale.phoenixlan.no" onChange={(e) => setDescription(e.target.value)} />
                                        </InputContainer>
                                    </CardContainer>
                                </InnerContainerRow>

                                <InnerContainerRow nowrap>
                                    <CardContainer>
                                        <InputContainer column extramargin>
                                            <InputLabel small>Sted</InputLabel>
                                            <InputElement {...register("location")} type="text" list="locations" value={location} onChange={(e) => setLocation(e.target.value)} />
                                        
                                            <datalist id="locations">
                                                <option value="Multisalen" />
                                                <option value="Vestibylen" />
                                                <option value="Radar Kafé" />
                                                <option value="Radar Scene" />
                                                <option value="Online" />
                                            </datalist>
                                        </InputContainer>
                                    </CardContainer>
                                </InnerContainerRow>

                                <InnerContainerRow nowrap>
                                    <CardContainer>
                                        <InputContainer column extramargin>
                                            <InputLabel small>Tidspunkt</InputLabel>
                                            <InputElement {...register("time", {required: true})} type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
                                        </InputContainer>
                                    </CardContainer>

                                    <CardContainer>
                                        <InputContainer column extramargin>
                                            <InputLabel small>Varighet</InputLabel>
                                            <InputElement {...register("duration", {required: true})} type="number" list="duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Varighet i minutter" />

                                            <datalist id="duration">
                                                <option value="0" label="0 minutter" />
                                                <option value="30" label="30 minutter" />
                                                <option value="60" label="1 time" />
                                                <option value="90" label="1 time, 30 minutter" />
                                                <option value="120" label="2 timer" />
                                            </datalist>
                                        </InputContainer>
                                    </CardContainer>
                                </InnerContainerRow>
                            </InnerContainer>
                            
                            <InnerContainer flex="1" floattop rowgap>
                                <InnerContainer>
                                    <InnerContainerTitle>Innstillinger</InnerContainerTitle>
                                    <InnerContainer>
                                        <CardContainer column extramargin>
                                            <InputElement {...register("pinned")} id='pinned' type="checkbox" />
                                            <CardContainerText>
                                                <InputLabel htmlFor='chief'>Festet programpost</InputLabel>
                                                <CardContainerDescriptiveText>Programposten vises øverst på infoskjermen både før hendelsen starter, og imens hendelsen skjer</CardContainerDescriptiveText>
                                            </CardContainerText>
                                        </CardContainer>
                                    </InnerContainer>
                                </InnerContainer>
                            </InnerContainer>
                        </InnerContainerRow>

                        <InnerContainerRow>
                            <InnerContainer flex="1">
                                <CardContainer>
                                    <PanelButton fillWidth type="submit" onClick={handleSubmit(createAgendaEntry)}>Opprett</PanelButton>
                                </CardContainer>
                                <CardContainer>
                                    <PanelButton fillWidth type="submit" onClick={() => history.push("/information/schedule/")}>Avbryt</PanelButton>
                                </CardContainer>
                            </InnerContainer>
                            <InnerContainer flex="1" />
                        </InnerContainerRow>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    } else {
        return (
            <>
                <DashboardContent>
                    <InnerContainer rowgap>
                        <InnerContainerRow>
                            <Notice type="error" visible>
                                Du har ikke tilgang til å opprette nye programposter.
                            </Notice>
                        </InnerContainerRow>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
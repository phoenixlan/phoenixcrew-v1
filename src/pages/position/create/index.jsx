import React, { useState, useContext, useEffect } from 'react';
import { Crew, Position } from "@phoenixlan/phoenix.js";
import { CardContainer, CardContainerDescriptiveText, CardContainerText, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputElement, InputLabel, InputSelect, PanelButton } from '../../../components/dashboard';

import { AuthenticationContext } from '../../../components/authentication';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useForm } from 'react-hook-form';
import { Notice } from '../../../components/containers/notice';
import { PageLoading } from '../../../components/pageLoading';

export const CreatePosition = () => {

    const { register, handleSubmit, formState: { errors } } = useForm({defaultValues: {crew_uuid: null, team_uuid: null}});

    let history = useHistory();

    // Import the following React contexts:
    const loggedinUser = useContext(AuthenticationContext);

    // Variables to keep track of changes in input components
    const [ name, setName ]                         = useState(null);
    const [ description, setDescription ]	        = useState(null);
    const [ attachedCrew, setAttachedCrew ]         = useState(undefined);
    const [ groupLeader, setGroupLeader ]           = useState(false);
    const [ crewList, setCrewList ]                 = useState(null);
    const [ loading, setLoading ]                   = useState(true);

    // States for error, used when attempting to create the position
    const [ error, setError ] = useState(false);

    const getCrews = async () => {
        try {
            setLoading(true);
            setCrewList(await Crew.getCrews());
        } catch(e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getCrews();
    }, [])

    const onSubmit = async (data) => {
        data.team_uuid = null;


        if(!attachedCrew) { data.crew_uuid = null;}
        if(!attachedCrew || !data.chief) { data.chief = false; }

        try { 
            let response = await Position.createPosition(data.name, data.description, data.chief, data.is_vanity, data.crew_uuid, data.team_uuid);
            history.push("/positions/" + response.uuid);
        } catch(e) {
            setError(e.message);
            console.error("An error occured while attempting to create the position.\n" + e)
        }
    }


    // Check if user has "admin" privilege and allow the user to view the create position page
    if(loading) {
        return(<PageLoading />)
    }
    if(loggedinUser.roles.includes("admin")) {
        return (
            <>
                <DashboardHeader border >
                    <DashboardTitle>
                        Opprett ny stilling
                    </DashboardTitle>
                    <DashboardSubtitle>
                        {name} 
                    </DashboardSubtitle>
                </DashboardHeader>
                <DashboardContent>
                    <InnerContainer rowgap>
                        <InnerContainerRow visible={error}>
                            <Notice fillWidth type="error" visible={error}>
                                Det oppsto en feil ved opprettelse av den nye stillingen.<br/>
                                {error}
                            </Notice>
                        </InnerContainerRow>

                        <InnerContainerRow>
                            <InnerContainer flex="1" floattop>
                                <InnerContainerTitle>Stillingsinformasjon</InnerContainerTitle>

                                <InnerContainerRow nowrap>
                                    <CardContainer>
                                        <InputContainer column extramargin>
                                            <InputLabel small>Stillingstittel</InputLabel>
                                            <InputElement {...register("name", {required: true})} type="text" value={name} onChange={(e) => setName(e.target.value)} />
                                        </InputContainer>
                                    </CardContainer>
                                </InnerContainerRow>

                                <InnerContainerRow nowrap>
                                    <CardContainer>
                                        <InputContainer column extramargin>
                                            <InputLabel small>Stillingsbeskrivelse</InputLabel>
                                            <InputElement {...register("description", {required: true})} type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                                        </InputContainer>
                                    </CardContainer>
                                </InnerContainerRow>
                            </InnerContainer>
                            
                            <InnerContainer flex="1" floattop rowgap>
                                <InnerContainer>
                                    <InnerContainerTitle>Tilknytning til crew</InnerContainerTitle>
                                    <InnerContainerRow norowgap nowrap>
                                        <CardContainer>
                                            <InputContainer column extramargin>
                                                <InputLabel small>Tilknytt crew</InputLabel>
                                                <InputSelect {...register("crew_uuid")} value={attachedCrew} onChange={(e) => setAttachedCrew(e.target.value)}>
                                                    <option value={""} label="Ingen tilknytning" />
                                                    {
                                                    crewList.map((crew) => (<option key={crew.uuid} value={crew.uuid}>{crew.name}</option>))
                                                    }
                                                    
                                                </InputSelect>
                                            </InputContainer>
                                        </CardContainer>
                                        <CardContainer />
                                    </InnerContainerRow>
                                </InnerContainer>

                                <InnerContainer>
                                    <InnerContainerTitle>Innstillinger</InnerContainerTitle>
                                    <InnerContainer>
                                        <CardContainer column extramargin>
                                            <InputElement {...register("chief")} id='chief' type="checkbox" disabled={!attachedCrew} />
                                            <CardContainerText>
                                                <InputLabel htmlFor='chief'>Gruppeleder stilling</InputLabel>
                                                <CardContainerDescriptiveText>OBS! Ved å huke av denne må stillingen knyttes til et crew.<br/>Gir gruppeledertilganger som å åpne crew, godkjenne avatarer og søknader, oppdatere timeplan, og sende eposter.</CardContainerDescriptiveText>
                                            </CardContainerText>
                                        </CardContainer>
                                        <CardContainer column extramargin>
                                            <InputElement {...register("is_vanity")} id='is_vanity' type="checkbox" />
                                            <CardContainerText>
                                                <InputLabel htmlFor='is_vanity'>Symbolsk stilling</InputLabel>
                                                <CardContainerDescriptiveText>Stillingstittelen til denne stillingen blir prioritert når du printer kort.</CardContainerDescriptiveText>
                                            </CardContainerText>
                                        </CardContainer>
                                    </InnerContainer>
                                </InnerContainer>
                            </InnerContainer>
                        </InnerContainerRow>

                        <InnerContainerRow>
                            <InnerContainer flex="1">
                                <CardContainer>
                                    <PanelButton fillWidth type="submit" onClick={handleSubmit(onSubmit)}>Bekreft</PanelButton>
                                </CardContainer>
                                <CardContainer>
                                    <PanelButton fillWidth type="submit" onClick={() => history.push("/positions/")}>Avbryt</PanelButton>
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
                                Du har ikke tilgang til å opprette nye stillinger
                            </Notice>
                        </InnerContainerRow>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
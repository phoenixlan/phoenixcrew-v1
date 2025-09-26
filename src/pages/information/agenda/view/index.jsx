import { useState, useContext, useEffect } from 'react';
import { Agenda, getCurrentEvent } from "@phoenixlan/phoenix.js";
import { CardContainer, CardContainerDescriptiveText, CardContainerText, DashboardContent, DashboardHeader, DashboardSubtitle, DashboardTitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputElement, InputLabel, LabelWarning, PanelButton } from '../../../../components/dashboard';

import { AuthenticationContext } from '../../../../components/authentication';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useForm } from 'react-hook-form';
import { Notice } from '../../../../components/containers/notice';
import { PageLoading } from '../../../../components/pageLoading';
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import { captureException } from "@sentry/browser";

export const EditAgendaEntry = () => {

    const history = useHistory();
    const { uuid } = useParams();

    // Import the following React contexts:
    const authContext = useContext(AuthenticationContext);
    const agendaManagement = authContext.roles.includes("admin" || "evemt_admin" || "info_admin" || "compo_admin");

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [ title, setTitle ] = useState(null);
    const [ description, setDescription ] = useState(null);
    const [ location, setLocation ] = useState(null);
    const [ duration, setDuration ] = useState(null);
    const [ deviatingLocation, setDeviatingLocation ] = useState(null);
    const [ deviatingTimeUnknown, setDeviatingTimeUnknown ] = useState(null);
    const [ deviatingInformation, setDeviatingInformation ] = useState(null);
    const [ pinned, setPinned ] = useState(false);
    const [ cancelled, setCancelled ] = useState(false);
    const [ loading, setLoading ] = useState(true);

    const [ stateDeviatingControl, setStateDeviatingControl ] = useState(false);
	
	const [ entryTimeISO, setEntryTimeISO ] = useState(null);
	const [ entryDeviatingTimeISO, setEntryDeviatingTimeISO ] = useState(null);

    // States for error, used when attempting to create the position
    const [ error, setError ] = useState(false);

    const load = async () => {
        setLoading(true);

        let entry;

        try {
            entry = await Agenda.getAgendaElement(uuid);

            // Fix timezone issue
            const entryTimeTimezoneOffset = new Date(entry.time*1000).getTimezoneOffset();
            const entryDeviatingTimeTimezoneOffset = new Date(entry.deviating_time*1000).getTimezoneOffset();

            setStateDeviatingControl(entry.deviating_time);

            setTitle(entry.title);
            setDescription(entry.description);
            setLocation(entry.location);
            setDuration(entry.duration);
            setEntryTimeISO(entry.time ? new Date(entry.time*1000-(60000*entryTimeTimezoneOffset)).toISOString().slice(0, 16) : undefined);
            setEntryDeviatingTimeISO(entry.deviating_time ? new Date(entry.deviating_time*1000-(60000*entryDeviatingTimeTimezoneOffset)).toISOString().slice(0, 16) : undefined)
            setDeviatingLocation(entry.deviating_location);
            setDeviatingTimeUnknown(entry.deviating_time_unknown);
            setDeviatingInformation(entry.deviating_information);
            setPinned(entry.pinned);
            setCancelled(entry.cancelled);
        } catch(e) {
            setError(e.message);
            captureException(e);
            console.error("An error occurred while attempting to retrieve the agenda entry.\n" + e);
        } finally {
            setLoading(false);
        }
    }

    const editAgendaEntry = async (data) => {
        const event = await getCurrentEvent();
        const duration = Number(data.duration);

        // If stateDeviatingControl is set to false, prevent the following variables to submit data.
		if(!stateDeviatingControl) {
			data.deviating_time = null;
		}

        const datetimeUnixTime = data.time ? new Date(data.time).getTime()/1000 : null;
		const datetimeUnixDeviatingTime = data.deviating_time ? new Date(data.deviating_time).getTime()/1000 : null;

        try {
            await Agenda.modifyAgendaEntry(uuid, event.uuid, data.title, data.description, datetimeUnixTime, duration, data.location, data.deviating_time_unknown, data.deviating_location, data.deviating_information, data.pinned, data.cancelled, datetimeUnixDeviatingTime);
        } catch(e) {
            setError(e.message);
            console.error("An error occured while attempting to edit the agenda entry.\n" + e);
        } finally {
            load();
        }
    }

    const deleteAgendaEntry = async () => {
        if(window.confirm("Er du sikker på at du vil fjerne programposten\n\"" + title + "\"?")) {
            try {
                await Agenda.deleteAgendaEntry(uuid);
            } catch(e) {
                setError(e.message);
                console.error("An error occured while attempting to delete the agenda entry.\n" + e);
            } finally {
                history.push('/information/schedule');
            }
        }
    }



    const handleSetCancelled = () => {
        if(!cancelled) {
            setCancelled(true);
            if(!deviatingInformation) {
                setDeviatingInformation("Programposten har blitt avlyst")
                setValue("deviating_information", "Programposten har blitt avlyst")
            }
        } 
        if(cancelled) {
            setCancelled(false);
            if(deviatingInformation == "Programposten har blitt avlyst") {
                setDeviatingInformation("");
                setValue("deviating_information", "");
            }
        }
    }

    const handleSetDeviatingTimeUnknown = () => {
        if(!deviatingTimeUnknown) {
            setDeviatingTimeUnknown(true);
            if(!deviatingInformation) {
                setDeviatingInformation("Programposten har blitt forsinket. Ny tid og informasjon kommer")
                setValue("deviating_information", "Programposten har blitt forsinket. Ny tid og informasjon kommer")
            }
        }
        if(deviatingTimeUnknown) {
            setDeviatingTimeUnknown(false);
            if(deviatingInformation == "Programposten har blitt forsinket. Ny tid og informasjon kommer") {
                setDeviatingInformation("")
                setValue("deviating_information", "")
            }
        }
    }

    useEffect(() => {
        load().catch(e => { 
            console.log(e);
        });
    }, [])

    // Check if user has "admin" privilege and allow the user to view the create position page
    if(loading) {
        return(<PageLoading />)
    }
    if(agendaManagement) {
        return (
            <>
                <DashboardHeader border >
                    <DashboardTitle>
                        Oppdater programpost
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
                                Det oppsto en feil ved endring av programposten<br/>
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
                                        </InputContainer>
                                    </CardContainer>
                                    <CardContainer>
                                        <InputContainer column extramargin>
                                            <InputLabel small>Nytt sted</InputLabel>
                                            <InputElement {...register("deviating_location")} type="text" tabIndex={!stateDeviatingControl ? "-1" : undefined} value={deviatingLocation} onChange={(e) => setDeviatingLocation(e.target.value)} list="locations" />
                                        </InputContainer>
                                    </CardContainer>

                                    <datalist id="locations">
                                        <option value="Multisalen" />
                                        <option value="Vestibylen" />
                                        <option value="Radar Kafé" />
                                        <option value="Radar Scene" />
                                        <option value="Online" />
                                    </datalist>
                                </InnerContainerRow>

                                <InnerContainerRow norwap>
                                </InnerContainerRow>

                                <InnerContainerRow nowrap>
                                    <CardContainer>
                                        <InputContainer column extramargin>
                                            <InputLabel small>Tidspunkt</InputLabel>
                                            <InputElement {...register("time", {required: true})} type="datetime-local" value={entryTimeISO??null} onChange={(e) => setEntryTimeISO(e.target.value)} />
                                        </InputContainer>
                                    </CardContainer>
                                    <CardContainer>
                                        <InputContainer column extramargin disabled={!stateDeviatingControl || deviatingTimeUnknown}>
                                            <InputLabel small color={entryDeviatingTimeISO ? "#f57c00" : null}>Nytt tidspunkt ved forsinkelse <LabelWarning title="OBS! Nytt tidspunkt vises på infoskjermen!" visible={entryDeviatingTimeISO} /></InputLabel>
                                            <InputElement {...register("deviating_time", {required: stateDeviatingControl})} type="datetime-local" tabIndex={!stateDeviatingControl ? "-1" : undefined} value={entryDeviatingTimeISO??null} onChange={(e) => setEntryDeviatingTimeISO(e.target.value)} />
                                        </InputContainer>
                                    </CardContainer>
                                </InnerContainerRow>

                                <InnerContainerRow norwap>
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
                                    <CardContainer />
                                </InnerContainerRow>

                                <InnerContainerRow norwap>
                                    <CardContainer>
                                        <InputContainer column extramargin>
                                            <InputLabel small color={deviatingInformation ? "#f57c00" : null}>Varslingstekst <LabelWarning title="OBS! Denne tekst vil vises på infoskjermen!" visible={deviatingInformation} /></InputLabel>
                                            <InputElement {...register("deviating_information")} type="text" value={deviatingInformation} onChange={(e) => setDeviatingInformation(e.target.value)} placeholder={cancelled ? "Hendelsen har blitt avlyst" : deviatingTimeUnknown ? "Hendelsen har blitt forsinket, ny tid og informasjon kommer" : null} />
                                        </InputContainer>
                                    </CardContainer>
                                </InnerContainerRow>
                            </InnerContainer>
                            
                            <InnerContainer flex="1" floattop rowgap>
                                <InnerContainer>
                                    <InnerContainerTitle>Innstillinger</InnerContainerTitle>
                                    <InnerContainer>
                                        <CardContainer column extramargin>
                                            <InputElement {...register("pinned")} id='pinned' type="checkbox" checked={pinned} onChange={() => setPinned(!pinned)} />
                                            <CardContainerText>
                                                <InputLabel>Festet programpost</InputLabel>
                                                <CardContainerDescriptiveText>Programposten vises øverst på infoskjermen.</CardContainerDescriptiveText>
                                            </CardContainerText>
                                        </CardContainer>
                                        <CardContainer column extramargin>
                                            <InputElement type="checkbox" checked={stateDeviatingControl} onChange={() => setStateDeviatingControl(!stateDeviatingControl)} disabled={deviatingTimeUnknown || cancelled} />
                                            <CardContainerText>
                                                <InputLabel>Forsinket programpost</InputLabel>
                                                <CardContainerDescriptiveText>Programpostens opprinnelige tid blir stryket over<br/>Ny estimert tid vises i gul tekst.</CardContainerDescriptiveText>
                                            </CardContainerText>
                                        </CardContainer>
                                        <CardContainer column extramargin>
                                            <InputElement {...register("deviating_time_unknown")} type="checkbox" tabIndex={cancelled ? "-1" : undefined} checked={deviatingTimeUnknown} onChange={() => handleSetDeviatingTimeUnknown()} disabled={cancelled || stateDeviatingControl} /> 
                                            <CardContainerText>
                                                <InputLabel>Forsinket programpost på ubestemt tid</InputLabel>
                                                <CardContainerDescriptiveText>Programposten opprinnelige tid blir stryket over<br/>Ny estimert tid blir oppført med TBD (To be determined).</CardContainerDescriptiveText>
                                            </CardContainerText>
                                        </CardContainer>
                                        <CardContainer column extramargin>
                                            <InputElement {...register("cancelled")} type="checkbox" checked={cancelled} onChange={() => {handleSetCancelled()}} disabled={stateDeviatingControl || deviatingTimeUnknown} />
                                            <CardContainerText>
                                                <InputLabel>Avlyst</InputLabel>
                                                <CardContainerDescriptiveText>Programposten vises som avlyst på informasjonsskjermen.</CardContainerDescriptiveText>
                                            </CardContainerText>
                                        </CardContainer>
                                    </InnerContainer>
                                </InnerContainer>
                            </InnerContainer>
                        </InnerContainerRow>

                        <InnerContainerRow>
                            <InnerContainer flex="1">
                                <CardContainer>
                                    <PanelButton fillWidth type="submit" onClick={handleSubmit(editAgendaEntry)}>Oppdater programpost</PanelButton>
                                </CardContainer>
                                <CardContainer>
                                    <PanelButton fillWidth type="submit" onClick={handleSubmit(deleteAgendaEntry)}>Slett programpost</PanelButton>
                                </CardContainer>
                                <CardContainer>
                                    <PanelButton fillWidth type="submit" onClick={() => history.push("/information/schedule/")}>Tilbake</PanelButton>
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
                                Du har ikke tilgang til å redigere eksisterende programposter.
                            </Notice>
                        </InnerContainerRow>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
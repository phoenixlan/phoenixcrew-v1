import { useForm } from "react-hook-form";
import { InnerContainer, InnerContainerRow, InputButton, InputCheckbox, InputContainer, InputElement, InputLabel, LabelWarning } from "../../../dashboard"
import { Agenda, getCurrentEvent } from '@phoenixlan/phoenix.js'
import { FormButton, FormInput } from "../../../form";
import { useContext, useEffect, useState } from "react";
import { Notice } from "../../../containers/notice";
import { AuthenticationContext } from "../../../authentication";

export const EditAgendaEntry = ({functions, entries}) => {
    //const [ loading, setLoading ] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [ title, setTitle ]											= useState(entries.title);
    const [ description, setDescription ]								= useState(entries.description);
    const [ time, setTime]												= useState(entries.time ? new Date(entries.time ? entries.time*1000+7200000 : undefined).toISOString().slice(0, 16) : undefined)
    const [ location, setLocation ]										= useState(entries.location);
	const [ deviatingTime, setDeviatingTime ]							= useState(entries.deviating_time ? new Date(entries.deviating_time ? entries.deviating_time*1000+7200000 : undefined).toISOString().slice(0, 16) : undefined);
	const [ deviatingLocation, setDeviatingLocation ]					= useState(entries.deviating_location);
	const [ deviatingInformation, setDeviatingInformation]				= useState(entries.deviating_information);
	const [ statePinned, setStatePinned ] 								= useState(entries.state_pinned);
	const [ stateDeviatingTimeUnknown, setStateDeviatingTimeUnknown ] 	= useState(entries.state_deviating_time_unknown);
	const [ stateCancelled, setStateCancelled ] 						= useState(entries.state_cancelled);
	const [ stateDeviatingControl, setStateDeviatingControl]			= useState(undefined);


    useEffect(() => {
		/*
			onLoad_CheckDeviatingControl:
			Input fields like deviating location, deviating time and deviating information is normally
			disabled to prevent the user from using the wrong fields. We use this function to check if
			the database has deviating information, if so, enable the fields on load.
		*/
		const onLoad_CheckDeviatingControl = () => {
			if(deviatingTime || deviatingLocation || deviatingInformation) {
				setStateDeviatingControl(true);
			}
		}

		onLoad_CheckDeviatingControl();
    }, []);

	const user = useContext(AuthenticationContext);

    const onSubmit = async (data) => {
        // Get current event so we can get its UUID
        const event = 					await getCurrentEvent();



		// If stateDeviatingControl is set to false, prevent the following variables to submit data.
		if(!stateDeviatingControl) {
			data.deviating_time = null;
			data.deviating_location = null;
			data.deviating_information = null;
		}

		const currentUser 			= user.authUser.uuid; 
		const dateUnixTime 			= data.time ? new Date(data.time).getTime()/1000 : null;
		const dateUnixDeviatingTime = data.deviating_time ? new Date(data.deviating_time).getTime()/1000 : "";

		// Try to modify the agenda entry
		try {
			await Agenda.modifyAgendaEntry(data.uuid, event.uuid, data.title, data.description, dateUnixTime, data.location, dateUnixDeviatingTime, data.deviating_location, data.deviating_information, data.state_pinned, data.state_deviating_time_unknown, data.state_cancelled, currentUser)
        } catch(e) {
			console.error("An error occured while attempting to update the agenda entry.\n" + e)
		}
        functions.exitFunction();
    }

	const onDelete = async (data) => {
		if(!await Agenda.deleteAgendaEntry(data.uuid)) {
			console.error("An error occured while attempting to delete agenda element " + data.uuid + ".")
		}
		functions.exitFunction();
	}

	return (
		<>
			<form>
				<InnerContainerRow>
					<InnerContainer flex="1">
						<InnerContainer style={{display: "none"}}>
							<Notice type="info">
								<b>Skrivefeil? Kosmetiske endringer?</b>
								Endre kun tittel, beskrivelse, sted og tid dersom det er kosmetiske endringer, altså store/små bokstaver, skrivefeil, tilleggsinformasjon, osv. Det er dette som er den opprinnelige informasjonen og vises som vanlig på infoskjermene og programmet. Dette bør unngås å endre i etterkant.
							</Notice>
							<Notice type="warning">
								<b>Forsinkelse, problemer, avvik og ny informasjon</b>
								Dersom det oppstår problemer på stedet som gjør at det som er planlagt blir forsinket i en lenger periode skal du benytte avvikende sted, avvikende tid og informasjon om avvik.<br/>
								Dette er ny og oppdatert informasjon gitt ut av oss, og vil vises i gul/oransje skrift på infoskjermene og programmet for å indikere et avvik fra den opprinnelige planen.
							</Notice>
						</InnerContainer>

				
						<InnerContainer flex="1">
							<InputElement type="hidden" value={entries.uuid} {...register("uuid")} />
							<InputContainer column extramargin>
								<InputLabel small>Tittel</InputLabel>
								<InputElement {...register("title")} type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
							</InputContainer>
							<InputContainer column extramargin>
								<InputLabel small>Beskrivelse</InputLabel>
								<InputElement {...register("description")} type="text" required value={description} onChange={(e) => setDescription(e.target.value)} />
							</InputContainer>
							<InnerContainerRow nopadding nowrap>
								<InputContainer column extramargin>
									<InputLabel small>Sted</InputLabel>
									<InputElement {...register("location")} type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
								</InputContainer>
								<InputContainer column extramargin disabled={!stateDeviatingControl}>
									<InputLabel small>Nytt sted</InputLabel>
									<InputElement {...register("deviating_location")} type="text" tabIndex={!stateDeviatingControl ? "-1" : undefined} value={deviatingLocation} onChange={(e) => setDeviatingLocation(e.target.value)} />
								</InputContainer>
							</InnerContainerRow>
							<InnerContainerRow nopadding nowrap>
								<InputContainer column extramargin>
									<InputLabel small>Tidspunkt</InputLabel>
									<InputElement {...register("time")} type="datetime-local"value={time??null} onChange={(e) => setTime(e.target.value)} />
								</InputContainer>
								<InputContainer column extramargin disabled={!stateDeviatingControl}>
									<InputLabel small>Nytt tidspunkt</InputLabel>
									<InputElement {...register("deviating_time")} type="datetime-local" tabIndex={!stateDeviatingControl ? "-1" : undefined} value={deviatingTime??null} onChange={(e) => setDeviatingTime(e.target.value)} />
								</InputContainer>
							</InnerContainerRow>
							<InputContainer column extramargin disabled={!stateDeviatingControl}> 
								<InputLabel small>Begrunnelse for forsinkelse eller problem</InputLabel>
								<InputElement {...register("deviating_information")} type="text" value={deviatingInformation} tabIndex={!stateDeviatingControl ? "-1" : undefined} onChange={(e) => setDeviatingInformation(e.target.value)} />
							</InputContainer>
							<InputContainer>
								<InputLabel small>Innstillinger</InputLabel>
							</InputContainer>
							<InputContainer>
								<InputElement type="checkbox" checked={stateDeviatingControl} onChange={() => setStateDeviatingControl(!stateDeviatingControl)} /> Forsinket hendelse
							</InputContainer>
							<InputContainer>
								<InputElement {...register("state_pinned")} type="checkbox" checked={statePinned} onChange={() => setStatePinned(!statePinned)} /> Festet hendelse <span title="Fest oppføringen til toppen av infoskjermen">(?)</span>
							</InputContainer>
							<InputContainer>
								<InputElement {...register("state_deviating_time_unknown")} type="checkbox" disabled={stateCancelled} checked={stateDeviatingTimeUnknown} onChange={() => setStateDeviatingTimeUnknown(!stateDeviatingTimeUnknown)} />  Hendelse forsinket til ubestemt tidspunkt
							</InputContainer>
							<InputContainer extramargin>
								<InputElement {...register("state_cancelled")} type="checkbox" checked={stateCancelled} onChange={() => {setStateCancelled(!stateCancelled); setStateDeviatingTimeUnknown(stateCancelled ? false : null)}} /> Avlys hendelse
							</InputContainer>
							<InputContainer>
								<InputButton type="submit" onClick={handleSubmit(onSubmit)}>Endre</InputButton>
								<InputButton type="submit" onClick={handleSubmit(onDelete)}>Slett</InputButton>
							</InputContainer>
						</InnerContainer>
					</InnerContainer>
				</InnerContainerRow>
			</form>
		</>
	)
} 
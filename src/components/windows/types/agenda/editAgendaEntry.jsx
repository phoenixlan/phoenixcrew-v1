import { useForm } from "react-hook-form";
import { InnerContainer, InnerContainerRow, InputContainer, InputElement, InputLabel, PanelButton } from "../../../dashboard"
import { Agenda, getCurrentEvent } from '@phoenixlan/phoenix.js'
import { useEffect, useState } from "react";
import { Notice } from "../../../containers/notice";

export const EditAgendaEntry = ({functions, entries}) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [ title, setTitle ]											= useState(entries.title);
    const [ description, setDescription ]								= useState(entries.description);
    const [ time, setTime ]												= useState(entries.time ? new Date(entries.time ? entries.time*1000+7200000 : undefined).toISOString().slice(0, 16) : undefined)
    const [ location, setLocation ]										= useState(entries.location);
	const [ deviatingTime, setDeviatingTime ]							= useState(entries.deviating_time ? new Date(entries.deviating_time ? entries.deviating_time*1000+7200000 : undefined).toISOString().slice(0, 16) : undefined);
	const [ deviatingLocation, setDeviatingLocation ]					= useState(entries.deviating_location);
	const [ deviatingTimeUnknown, setDeviatingTimeUnknown ] 			= useState(entries.deviating_time_unknown);
	const [ deviatingInformation, setDeviatingInformation ]				= useState(entries.deviating_information);
	const [ statePinned, setStatePinned ] 								= useState(entries.pinned);
	const [ stateCancelled, setStateCancelled ] 						= useState(entries.cancelled);
	const [ stateDeviatingControl, setStateDeviatingControl ]			= useState(undefined);

    useEffect(() => {
		/*
			checkDeviatingControl:
			Input fields like deviating location, deviating time and deviating information is normally
			disabled to prevent the user from using the wrong fields. We use this function to check if
			the database has deviating information, if so, enable the fields on load.
		*/
		const checkDeviatingControl = () => {
			if(deviatingTime || deviatingLocation || deviatingInformation || deviatingTimeUnknown) {
				setStateDeviatingControl(true);
			}
		}

		checkDeviatingControl();
    }, []);

    const onSubmit = async (data) => {
        // Get current event so we can get its UUID
        const event = await getCurrentEvent();

		// If stateDeviatingControl is set to false, prevent the following variables to submit data.
		if(!stateDeviatingControl) {
			data.deviating_time = null;
			data.deviating_location = null;
			data.deviating_information = null;
			data.deviating_time_unknown = false;
		}

		// If deviatingTimeUnknown is set to true and no information has been set, set a default entry.
		if(deviatingTimeUnknown) {
			if(!deviatingInformation) {
				data.deviating_information = "Hendelsen har blitt forsinket, ny tid og informasjon kommer";
			}
		}

		// If stateCancelled is set to true and no information has been set, set a default entry. 
		if(stateCancelled) {
			if(!deviatingInformation) {
				data.deviating_information = "Hendelsen har blitt avlyst";
			}
		}

		const dateUnixTime 			= data.time ? new Date(data.time).getTime()/1000 : null;
		const dateUnixDeviatingTime = data.deviating_time ? new Date(data.deviating_time).getTime()/1000 : null;

		// Try to modify the agenda entry
		try {
			await Agenda.modifyAgendaEntry(data.uuid, event.uuid, data.title, data.description, dateUnixTime, data.location, data.deviating_time_unknown, data.deviating_location, data.deviating_information, data.pinned, data.cancelled, dateUnixDeviatingTime)
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

				
						<InnerContainer flex="1" nopadding>
							<InputElement type="hidden" value={entries.uuid} {...register("uuid")} />
							<InputContainer column extramargin>
								<InputLabel small>Tittel</InputLabel>
								<InputElement {...register("title", {required: true})} type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
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
									<InputElement {...register("time", {required: true})} type="datetime-local"value={time??null} onChange={(e) => setTime(e.target.value)} />
								</InputContainer>
								<InputContainer column extramargin disabled={!stateDeviatingControl || deviatingTimeUnknown}>
									<InputLabel small>Nytt tidspunkt</InputLabel>
									<InputElement {...register("deviating_time")} type="datetime-local" tabIndex={!stateDeviatingControl ? "-1" : undefined} value={deviatingTime??null} onChange={(e) => setDeviatingTime(e.target.value)} />
								</InputContainer>
							</InnerContainerRow>
							<InputContainer column extramargin disabled={!stateDeviatingControl}> 
								<InputLabel small>Beskrivelse for forsinkelse eller problem</InputLabel>
								<InputElement {...register("deviating_information")} type="text" value={deviatingInformation} tabIndex={!stateDeviatingControl ? "-1" : undefined} onChange={(e) => setDeviatingInformation(e.target.value)} placeholder={stateCancelled ? "Hendelsen har blitt avlyst" : deviatingTimeUnknown ? "Hendelsen har blitt forsinket, ny tid og informasjon kommer" : null}/>
							</InputContainer>
							<InputContainer>
								<InputLabel small>Innstillinger</InputLabel>
							</InputContainer>
							<div>
								<InputContainer>
									<InputElement {...register("pinned")} type="checkbox" checked={statePinned} onChange={() => setStatePinned(!statePinned)} /> Festet hendelse
								</InputContainer>
								<InputContainer disabled={stateCancelled}>
									<InputElement type="checkbox" checked={stateDeviatingControl} onChange={() => setStateDeviatingControl(!stateDeviatingControl)} /> Forsinket hendelse
								</InputContainer>
								<InputContainer disabled={stateCancelled || !stateDeviatingControl}>
									<InputElement {...register("deviating_time_unknown")} type="checkbox" tabIndex={stateCancelled ? "-1" : undefined} checked={deviatingTimeUnknown} onChange={() => setDeviatingTimeUnknown(!deviatingTimeUnknown)} />  Hendelse forsinket til ubestemt tidspunkt
								</InputContainer>
								<InputContainer extramargin>
									<InputElement {...register("cancelled")} type="checkbox" checked={stateCancelled} onChange={() => {setStateCancelled(!stateCancelled); setDeviatingTimeUnknown(stateCancelled ? false : null); setDeviatingInformation("")}} /> Avlys hendelse
								</InputContainer>
							</div>
							<br />
							<InnerContainerRow mobileNoGap nopadding>
								<PanelButton type="submit" onClick={handleSubmit(onSubmit)} flex>Endre</PanelButton>
								<PanelButton type="submit" onClick={handleSubmit(onDelete)} flex>Slett</PanelButton>
							</InnerContainerRow>
						</InnerContainer>
					</InnerContainer>
				</InnerContainerRow>
			</form>
		</>
	)
} 
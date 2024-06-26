import { useForm } from "react-hook-form";
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInput, CardContainerInputWrapper, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InputContainer, InputElement, InputLabel, PanelButton } from "../../../dashboard"
import { Agenda, getCurrentEvent } from '@phoenixlan/phoenix.js'
import { useContext, useEffect, useState } from "react";
import { Notice } from "../../../containers/notice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation, faFont, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
import { WindowManagerContext } from "../../windowManager";

export const EditAgendaEntry = ({ entries }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

	// Inherit WindowManagerContext
    const windowManager = useContext(WindowManagerContext);

	// Variables to keep track of changes in input components
	const [ title, setTitle ]											= useState(entries.title);
	const [ description, setDescription ]								= useState(entries.description);
	const [ duration, setDuration ]										= useState(entries.duration);
	const [ location, setLocation ]										= useState(entries.location);
	const [ deviatingLocation, setDeviatingLocation ]					= useState(entries.deviating_location);
	const [ deviatingTimeUnknown, setDeviatingTimeUnknown ]				= useState(entries.deviating_time_unknown);
	const [ deviatingInformation, setDeviatingInformation ]				= useState(entries.deviating_information);
	const [ statePinned, setStatePinned ]								= useState(entries.pinned);
	const [ stateCancelled, setStateCancelled ]							= useState(entries.cancelled);
	const [ stateDeviatingControl, setStateDeviatingControl ]			= useState(undefined);


	// Variables to input components to fix timezone issue
	const entryTimeTimezoneOffset = new Date(entries.time*1000).getTimezoneOffset();
	const [ entryTimeISO, setEntryTimeISO ] = useState(new Date(entries.time*1000-(60000*entryTimeTimezoneOffset)).toISOString().slice(0, 16));

	const entryDeviatingTimeTimezoneOffset = new Date(entries.deviating_time*1000).getTimezoneOffset();
	const [ entryDeviatingTimeISO, setEntryDeviatingTimeISO ] = useState(entries.deviating_time ? new Date(entries.deviating_time*1000-(60000*entryDeviatingTimeTimezoneOffset)).toISOString().slice(0, 16) : undefined);

	// Error handling from API and JS
	const [ error, setError ]					= useState(undefined);

    useEffect(() => {
		/*
			checkDeviatingControl:
			Input fields like deviating location, deviating time and deviating information is normally
			disabled to prevent the user from using the wrong fields. We use this function to check if
			the database has deviating information, if so, enable the fields on load.
		*/
		const checkDeviatingControl = () => {
			if(entryDeviatingTimeISO || deviatingLocation || deviatingInformation || deviatingTimeUnknown) {
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

		// Try to modify the agenda entry, catch an error if the operation fails
		try { 
			await Agenda.modifyAgendaEntry(data.uuid, event.uuid, data.title, data.description, dateUnixTime, Number(data.duration), data.location, data.deviating_time_unknown, data.deviating_location, data.deviating_information, data.pinned, data.cancelled, dateUnixDeviatingTime);
			windowManager.exitWindow();
		} catch(e) {
			setError(e.message);
			console.error("An error occured while attempting to update the agenda entry.\n" + e);
		}
    }

	const onDelete = async (data) => {
		try {
			await Agenda.deleteAgendaEntry(data.uuid);
			windowManager.exitWindow();
		} catch(e) {
			console.error("An error occured while attempting to delete agenda element " + data.uuid + ".\n" + e);
		}
	}

	return (
		<>
			<InnerContainerRow flex="1">
				<InnerContainer flex="1" nopadding>
					<InnerContainer flex="1" mobileRowGap="0em" nopadding>
						<Notice visible={error} type="error" title="En feil har oppstått" description={error} />

						<InnerContainerTitle>Informasjon</InnerContainerTitle>

						<InputElement type="hidden" value={entries.uuid} {...register("uuid")} />
						<InnerContainerRow nopadding>
							<CardContainer>
								<CardContainerIcon>
									<CardContainerInnerIcon>
										<FontAwesomeIcon icon={faFont} />
									</CardContainerInnerIcon>
								</CardContainerIcon>
								<CardContainerInputWrapper>
									<CardContainerText>
										<InputLabel small>Tittel</InputLabel>
										<CardContainerInput {...register("title", {required: true})} type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
									</CardContainerText>
								</CardContainerInputWrapper>
							</CardContainer>
						</InnerContainerRow>

						<InnerContainerRow nopadding>
							<CardContainer>
								<CardContainerIcon />
								<CardContainerInputWrapper>
									<CardContainerText>
										<InputLabel small>Beskrivelse</InputLabel>
										<CardContainerInput {...register("description")} type="text" required value={description} onChange={(e) => setDescription(e.target.value)} />
									</CardContainerText>
								</CardContainerInputWrapper>
							</CardContainer>
						</InnerContainerRow>

						<InnerContainerRow nopadding>
							<CardContainer>
								<CardContainerIcon>
									<CardContainerInnerIcon>
										<FontAwesomeIcon icon={faMapPin} />
									</CardContainerInnerIcon>
								</CardContainerIcon>
								<CardContainerInputWrapper>
									<CardContainerText>
										<InputLabel small>Sted</InputLabel>
										<CardContainerInput {...register("location")} type="text" value={location} onChange={(e) => setLocation(e.target.value)} list="locations" />
									</CardContainerText>
									<CardContainerText disabled={!stateDeviatingControl}>
										<InputLabel small>Nytt sted</InputLabel>
										<CardContainerInput {...register("deviating_location")} type="text" tabIndex={!stateDeviatingControl ? "-1" : undefined} value={deviatingLocation} onChange={(e) => setDeviatingLocation(e.target.value)} list="locations" />
									</CardContainerText>
								</CardContainerInputWrapper>

								<datalist id="locations">
									<option value="Multisalen" />
									<option value="Vestibylen" />
									<option value="Radar Kafé" />
									<option value="Radar Scene" />
									<option value="Online" />
								</datalist>
							</CardContainer>
						</InnerContainerRow>

						<InnerContainerRow nopadding>
							<CardContainer>
								<CardContainerIcon>
									<CardContainerInnerIcon>
										<FontAwesomeIcon icon={faCalendar} />
									</CardContainerInnerIcon>
								</CardContainerIcon>
								<CardContainerInputWrapper>
									<CardContainerText>
										<InputLabel small>Tidspunkt</InputLabel>
										<CardContainerInput {...register("time", {required: true})} type="datetime-local" value={entryTimeISO??null} onChange={(e) => setEntryTimeISO(e.target.value)} />
									</CardContainerText>
									<CardContainerText disabled={!stateDeviatingControl || deviatingTimeUnknown}>
										<InputLabel small>Nytt tidspunkt</InputLabel>
										<CardContainerInput {...register("deviating_time")} type="datetime-local" tabIndex={!stateDeviatingControl ? "-1" : undefined} value={entryDeviatingTimeISO??null} onChange={(e) => setEntryDeviatingTimeISO(e.target.value)} />
									</CardContainerText>
								</CardContainerInputWrapper>
							</CardContainer>
						</InnerContainerRow>

						<InnerContainerRow nopadding nowrap>
							<CardContainer>
								<CardContainerIcon>
									<CardContainerInnerIcon>
										<FontAwesomeIcon icon={faClock} />
									</CardContainerInnerIcon>
								</CardContainerIcon>
								<CardContainerInputWrapper>
									<CardContainerText>
										<InputLabel small>Varighet (i minutter)</InputLabel>
										<CardContainerInput {...register("duration")} type="number" value={duration??null} onChange={(e) => setDuration(e.target.value)} list="duration" />
									</CardContainerText>
									<CardContainerText mobileHide />
								</CardContainerInputWrapper>

								<datalist id="duration">
									<option value="30" label="30 minutter" />
									<option value="60" label="1 time" />
									<option value="90" label="1 time, 30 minutter" />
									<option value="120" label="2 timer" />
								</datalist>
							</CardContainer>
						</InnerContainerRow>

						<InnerContainerRow nopadding>
							<CardContainer>
								<CardContainerIcon>
									<CardContainerInnerIcon>
										<FontAwesomeIcon icon={faExclamation} />
									</CardContainerInnerIcon>
								</CardContainerIcon>
								<CardContainerInputWrapper>
									<CardContainerText disabled={!stateDeviatingControl || !stateCancelled}>
										<InputLabel small>Beskrivelse av forsinkelse eller problem</InputLabel>
										<CardContainerInput {...register("deviating_information")} type="text" value={deviatingInformation} tabIndex={!stateDeviatingControl ? "-1" : undefined} onChange={(e) => setDeviatingInformation(e.target.value)} placeholder={stateCancelled ? "Hendelsen har blitt avlyst" : deviatingTimeUnknown ? "Hendelsen har blitt forsinket, ny tid og informasjon kommer" : null} />
									</CardContainerText>
								</CardContainerInputWrapper>
							</CardContainer>
						</InnerContainerRow>

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
		</>
	)
} 
import { useForm } from "react-hook-form";
import { InnerContainer, InnerContainerRow, InputButton, InputCheckbox, InputContainer, InputElement, InputLabel, LabelWarning } from "../../../dashboard"
import { Agenda, getCurrentEvent } from '@phoenixlan/phoenix.js'
import { FormButton, FormInput } from "../../../form";
import { useEffect, useState } from "react";
import { Notice } from "../../../containers/notice";

export const EditAgendaEntry = ({functions, entries}) => {
    //const [ loading, setLoading ] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [ title, setTitle ]											= useState(entries.title);
    const [ description, setDescription ]								= useState(entries.description);
    const [ time, setTime]												= useState(entries.time ? new Date(entries.time ? entries.time*1000+3600000 : null).toISOString().slice(0, 16) : null)
    const [ location, setLocation ]										= useState(entries.location);
	const [ deviatingTime, setDeviatingTime ]							= useState(entries.deviating_time ? new Date(entries.deviating_time ? entries.deviating_time*1000+3600000 : null).toISOString().slice(0, 16) : null);
	const [ deviatingLocation, setDeviatingLocation ]					= useState(entries.deviating_location);
	const [ deviatingInformation, setDeviatingInformation]				= useState(entries.deviating_information);
	const [ statePinned, setStatePinned ] 								= useState(entries.state_pinned);
	const [ stateDeviatingTimeUnknown, setStateDeviatingTimeUnknown ] 	= useState(entries.state_deviating_time_unknown);
	const [ stateCancelled, setStateCancelled ] 						= useState(entries.state_cancelled);

    useEffect(() => {
    }, []);

    const onSubmit = async (data) => {
        // Get current event so we can get its UUID
        const event = 					await getCurrentEvent();

		const dateUnixTime 			= data.time ? new Date(data.time).getTime()/1000 : null;
		const dateUnixDeviatingTime = data.deviating_time ? new Date(data.deviating_time).getTime()/1000 : null;

        if(!await Agenda.modifyAgendaEntry(data.uuid, event.uuid, data.title, data.description, dateUnixTime, data.location, dateUnixDeviatingTime, data.deviating_location, data.deviating_information, data.state_pinned, data.state_deviating_time_unknown, data.state_cancelled)) {
            console.log("fucked up")
        }
        
        functions.exitFunction();
    }

	return (
		<>
			<form>
				<InnerContainerRow>
					<InnerContainer flex="1">
						<InnerContainer>
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
								<InputContainer column extramargin>
									<InputLabel small>Avvikende sted</InputLabel>
									<InputElement {...register("deviating_location")} type="text" value={deviatingLocation} onChange={(e) => setDeviatingLocation(e.target.value)} />
								</InputContainer>
							</InnerContainerRow>
							<InnerContainerRow nopadding nowrap>
								<InputContainer column extramargin>
									<InputLabel small>Tidspunkt</InputLabel>
									<InputElement {...register("time")} type="datetime-local" value={time??null} onChange={(e) => setTime(e.target.value)} />
								</InputContainer>
								<InputContainer column extramargin>
									<InputLabel small>Avvikende tidspunkt</InputLabel>
									<InputElement {...register("deviating_time")} type="datetime-local" required value={deviatingTime??null} onChange={(e) => setDeviatingTime(e.target.value)} />
								</InputContainer>
							</InnerContainerRow>
							<InputContainer column extramargin>
								<InputLabel small>Informasjon om avvik</InputLabel>
								<InputElement {...register("deviating_information")} type="text" value={deviatingInformation} onChange={(e) => setDeviatingInformation(e.target.value)} />
							</InputContainer>
							<InputContainer>
								<InputLabel small>Parametere</InputLabel>
							</InputContainer>
							<InputContainer>
								<InputElement {...register("state_pinned")} type="checkbox" checked={statePinned} onChange={() => setStatePinned(!statePinned)} /> Festet oppføring <span title="Fest oppføringen til toppen av infoskjermen">(?)</span>
							</InputContainer>
							<InputContainer>
								<InputElement {...register("state_deviating_time_unknown")} type="checkbox" disabled={stateCancelled} checked={stateDeviatingTimeUnknown} onChange={() => setStateDeviatingTimeUnknown(!stateDeviatingTimeUnknown)} /> Oppføring flyttet til ubestemt tidspunkt
							</InputContainer>
							<InputContainer extramargin>
								<InputElement {...register("state_cancelled")} type="checkbox" checked={stateCancelled} onChange={() => {setStateCancelled(!stateCancelled); setStateDeviatingTimeUnknown(stateCancelled ? false : null)}} /> Avlys oppføring
							</InputContainer>
							<InputContainer>
								<InputButton type="submit" onClick={handleSubmit(onSubmit)}>Endre</InputButton>
								<InputButton type="">Slett</InputButton>
							</InputContainer>
						</InnerContainer>
					</InnerContainer>
				</InnerContainerRow>
			</form>
		</>
	)
} 
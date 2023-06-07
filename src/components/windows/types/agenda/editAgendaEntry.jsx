import { useForm } from "react-hook-form";
import { InnerContainer, InnerContainerRow, InputButton, InputCheckbox, InputContainer, InputElement, InputLabel, LabelWarning } from "../../../dashboard"
import { Agenda, getCurrentEvent } from '@phoenixlan/phoenix.js'
import { FormButton, FormInput } from "../../../form";
import { useEffect, useState } from "react";
import { Notice } from "../../../containers/notice";

export const EditAgendaEntry = ({functions, entries}) => {
    //const [ loading, setLoading ] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [ title, setTitle ]						= useState(entries.title);
    const [ description, setDescription ]			= useState(entries.description);
    const [ location, setLocation ]					= useState(entries.newLocation);
    const [ newLocation, setNewLocation ]			= useState(entries.newLocation);
    const [ HTMLtime, setHTMLtime]					= useState(entries.time ? new Date(entries.time ? entries.time*1000+3600000 : null).toISOString().slice(0, 16) : null)
    const [ newHTMLtime, setNewHTMLtime]			= useState(entries.newTime ? new Date(entries.newTime ? entries.newTime*1000+3600000 : null).toISOString().slice(0, 16) : null)
    const [ modifyReason, setModifyReason ]			= useState(entries.modifyReason);
    const [ sticky, setSticky ]						= useState(entries.sticky);
    const [ noTime, setNoTime ]						= useState(entries.noTime);
    const [ undefinedNewTime, setUndefinedNewTime ]	= useState(entries.undefinedNewTime);
    const [ cancelled, setCancelled ]				= useState(entries.cancelled);

    useEffect(() => {
    }, []);

    

    

    const onSubmit = async (data) => {
        // Get current event so we can get its UUID
        const event = await getCurrentEvent();
        const dateUnixTime = new Date(data.newTime);

        if(!await Agenda.modifyAgendaEntry(data.uuid, data.title, data.description, event.uuid, data.newLocation, dateUnixTime.getTime()/1000, data.modifyReason, data.sticky)) {
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
									<InputElement {...register("newLocation")} type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
								</InputContainer>
							</InnerContainerRow>
							<InnerContainerRow nopadding nowrap>
								<InputContainer column extramargin>
									<InputLabel small>Tidspunkt</InputLabel>
									<InputElement {...register("time")} type="datetime-local" value={HTMLtime??null} onChange={(e) => setHTMLtime(e.target.value)} />
								</InputContainer>
								<InputContainer column extramargin>
									<InputLabel small>Avvikende tidspunkt</InputLabel>
									<InputElement {...register("newTime")} type="datetime-local" required value={newHTMLtime??null} onChange={(e) => setNewHTMLtime(e.target.value)} />
								</InputContainer>
							</InnerContainerRow>
							<InputContainer column extramargin>
								<InputLabel small>Informasjon om avvik</InputLabel>
								<InputElement {...register("modifyReason")} type="text" value={modifyReason} onChange={(e) => setModifyReason(e.target.value)} />
							</InputContainer>
							<InputContainer>
								<InputLabel small>Parametere</InputLabel>
							</InputContainer>
							<InputContainer>
								<InputElement {...register("sticky")} type="checkbox" checked={sticky} onChange={() => setSticky(!sticky)} /> Festet oppføring <span title="Fest oppføringen til toppen av infoskjermen">(?)</span>
							</InputContainer>
							<InputContainer>
								<InputElement {...register("undefinedNewTime")} type="checkbox" disabled={cancelled} checked={undefinedNewTime} onChange={() => setUndefinedNewTime(!undefinedNewTime)} /> Oppføring flyttet til ubestemt tidspunkt
							</InputContainer>
							<InputContainer extramargin>
								<InputElement {...register("cancelled")} type="checkbox" checked={cancelled} onChange={() => {setCancelled(!cancelled); setUndefinedNewTime(cancelled ? false : null)}} /> Avlys oppføring
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
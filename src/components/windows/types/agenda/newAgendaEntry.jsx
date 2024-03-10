import { useForm } from "react-hook-form";
import { InnerContainer, InnerContainerRow, InputContainer, InputElement, InputLabel, PanelButton } from "../../../dashboard"
import { Agenda, getCurrentEvent } from '@phoenixlan/phoenix.js'


export const NewAgendaEntry = ({functions}) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    
    const onSubmit = async (data) => {
        // Get current event so we can get its UUID
        const event = await getCurrentEvent();   

        const dateUnixTime = new Date(data.time);

        try {
            await Agenda.createAgendaEntry(event.uuid, data.title, data.description, data.location, dateUnixTime.getTime()/1000, Number(data.duration), data.pinned)
            functions.exitFunction();
        } catch(e) {
            console.error("An error occured while attempting to create the agenda entry.\n" + e)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InnerContainerRow>
                    <InnerContainer flex="1">
                        <InnerContainer>
                            Du oppretter nå et element til programmet for kommende arrangement.<br/>
                            Elementet vises på hovedsiden under program og på infoskjermene som blir satt opp på arramgenentet.<br/><br/>
                        </InnerContainer>

                
                        <InnerContainer flex="1" nopadding>
                            <InputContainer column extramargin>
                                <InputLabel small>Tittel</InputLabel>
                                <InputElement {...register("title", {required: true})} type="text" placeholder="Eks. Minecraft: Battle Royale" />
                            </InputContainer>
                            <InputContainer column extramargin>
                                <InputLabel small>Beskrivelse</InputLabel>
                                <InputElement {...register("description")} type="text" placeholder="Eks. Runde 1 av 3 • FFA Konkurranse • Delta på mc.phoenixlan.no" />
                            </InputContainer>
                            <InputContainer column extramargin>
                                <InputLabel small>Sted</InputLabel>
                                <InputElement {...register("location")} type="text" list="locations" />

                                <datalist id="locations">
									<option value="Multisalen" />
									<option value="Vestibylen" />
									<option value="Radar Kafé" />
									<option value="Radar Scene" />
									<option value="Online" />
								</datalist>
                            </InputContainer>
                            <InnerContainerRow nopadding nowrap>
                                <InnerContainerRow nopadding nowrap flex="1">
                                    <InputContainer column extramargin>
                                        <InputLabel small>Tidspunkt</InputLabel>
                                        <InputElement {...register("time", {required: true})} type="datetime-local" />
                                    </InputContainer>
                                </InnerContainerRow>
                                <InnerContainerRow nopadding nowrap flex="1">
                                    <InputContainer column extramargin>
                                        <InputLabel small>Varighet, minutter</InputLabel>
                                        <InputElement {...register("duration")} type="number" list="duration" defaultValue="0" suffix="minutter" />
                                    </InputContainer>
                                </InnerContainerRow>
                                
								<datalist id="duration">
                                    <option value="0" label="0 minutter" />
									<option value="30" label="30 minutter" />
									<option value="60" label="1 time" />
									<option value="90" label="1 time, 30 minutter" />
									<option value="120" label="2 timer" />
								</datalist>
                            </InnerContainerRow>
							<InputContainer>
								<InputLabel small>Innstillinger</InputLabel>
							</InputContainer>
							<InputContainer extramargin>
								<InputElement {...register("pinned")} type="checkbox" /> Festet oppføring
							</InputContainer>
                            <br />
							<InputContainer>
                                <PanelButton type="submit" onClick={handleSubmit(onSubmit)} flex>Opprett</PanelButton>
							</InputContainer>
                        </InnerContainer>
                    </InnerContainer>
                </InnerContainerRow>
            </form>
        </>
    )
} 
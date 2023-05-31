import { useForm } from "react-hook-form";
import { InnerContainer, InnerContainerRow, InputContainer, InputElement, InputLabel, LabelWarning } from "../../../dashboard"
import { Agenda, getCurrentEvent } from '@phoenixlan/phoenix.js'
import { FormButton, FormInput } from "../../../form";

export const NewAgendaEntry = ({functions}) => {

    console.log(functions);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        // Get current event so we can get its UUID
        const event = await getCurrentEvent();
        const dateUnixTime = new Date(data.time);

        if(!await Agenda.createAgendaEntry(data.title, data.description, event.uuid, dateUnixTime.getTime()/1000)) {
            console.log("fucked up")
        }
        functions.exitFunction();
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

                
                        <InnerContainer flex="1">
                            <InputContainer column extramargin>
                                <InputLabel small>Tittel</InputLabel>
                                <InputElement type="text" {...register("title")} required />
                            </InputContainer>
                            <InputContainer column extramargin>
                                <InputLabel small>Beskrivelse</InputLabel>
                                <InputElement type="text" {...register("description")} required />
                            </InputContainer>
                            <InputContainer column extramargin>
                                <InputLabel small>Sted</InputLabel>
                                <InputElement type="text" {...register("location")} />
                            </InputContainer>
                            <InputContainer column extramargin>
                                <InputLabel small>Tidspunkt</InputLabel>
                                <InputElement type="datetime-local" {...register("time")} required />
                            </InputContainer>

                            <FormButton type="submit">Opprett!</FormButton>
                        </InnerContainer>
                    </InnerContainer>
                </InnerContainerRow>
            </form>
        </>
    )
} 
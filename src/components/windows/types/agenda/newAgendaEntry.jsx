import { useForm } from "react-hook-form";
import { InnerContainer, InnerContainerRow, InputButton, InputContainer, InputElement, InputLabel, LabelWarning } from "../../../dashboard"
import { Agenda, getCurrentEvent, User } from '@phoenixlan/phoenix.js'
import { FormButton, FormInput } from "../../../form";
import { useContext, useState } from "react";
import { AuthenticationContext } from "../../../authentication";

export const NewAgendaEntry = ({functions}) => {

    const [ statePinned, setStatePinned ] 	= useState(false);

    const user = useContext(AuthenticationContext);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = async (data) => {
        const currentUser = user.authUser.uuid;     // Get current user for logging
        const dateUnixTime = new Date(data.time);   // 
        const event = await getCurrentEvent();      // Get current event so we can get its UUID

        if(!await Agenda.createAgendaEntry(event.uuid, data.title, data.description, data.location, dateUnixTime.getTime()/1000, data.state_pinned, currentUser)) {
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
                                <InputElement {...register("title")} type="text" />
                            </InputContainer>
                            <InputContainer column extramargin>
                                <InputLabel small>Beskrivelse</InputLabel>
                                <InputElement {...register("description")} type="text" required />
                            </InputContainer>
                            <InputContainer column extramargin>
                                <InputLabel small>Sted</InputLabel>
                                <InputElement {...register("location")} type="text"/>
                            </InputContainer>
                            <InputContainer column extramargin>
                                <InputLabel small>Tidspunkt</InputLabel>
                                <InputElement {...register("time")} type="datetime-local" required />
                            </InputContainer>
							<InputContainer>
								<InputLabel small>Parametere</InputLabel>
							</InputContainer>
							<InputContainer extramargin>
								<InputElement {...register("state_pinned")} type="checkbox" /> Festet oppføring
							</InputContainer>
							<InputContainer>
								<InputButton type="submit" onClick={handleSubmit(onSubmit)}>Opprett oppføring</InputButton>
							</InputContainer>
                        </InnerContainer>
                    </InnerContainer>
                </InnerContainerRow>
            </form>
        </>
    )
} 
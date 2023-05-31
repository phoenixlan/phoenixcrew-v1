import { useForm } from "react-hook-form";
import { InnerContainer, InnerContainerRow, InputCheckbox, InputContainer, InputElement, InputLabel, LabelWarning } from "../../../dashboard"
import { Agenda, getCurrentEvent } from '@phoenixlan/phoenix.js'
import { FormButton, FormInput } from "../../../form";
import { useEffect, useState } from "react";

export const EditAgendaEntry = ({functions, entries}) => {
    //const [ loading, setLoading ] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [ title, setTitle ]               = useState(entries.title);
    const [ description, setDescription ]   = useState(entries.description);
    const [ newLocation, setNewLocation ]   = useState(entries.newLocation);
    const [ newTime, setNewTime ]           = useState(entries.newTime);
    const [ newHTMLtime, setNewHTMLtime]    = useState(new Date(entries.newTime ? entries.newTime*1000+3600000 : null).toISOString().slice(0, 16))
    const [ modifyReason, setModifyReason ] = useState(entries.modifyReason);
    const [ sticky, setSticky ]             = useState(entries.sticky);

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

    if(true) {
        return (
            <>
                <form>
                    <InnerContainerRow>
                        <InnerContainer flex="1">
                            <InnerContainer>
                                Du oppretter nå et element til programmet for kommende arrangement.<br/>
                                Elementet vises på hovedsiden under program og på infoskjermene som blir satt opp på arramgenentet.<br/><br/>
                            </InnerContainer>

                    
                            <InnerContainer flex="1">
                                <InputElement type="hidden" {...register("uuid")} value={entries.uuid} />
                                <InputContainer column extramargin>
                                    <InputLabel small>Tittel</InputLabel>
                                    <InputElement type="text" {...register("title")} required value={title} onChange={(e) => setTitle(e.target.value)} />
                                </InputContainer>
                                <InputContainer column extramargin>
                                    <InputLabel small>Beskrivelse</InputLabel>
                                    <InputElement type="text" {...register("description")} required value={description} onChange={(e) => setDescription(e.target.value)} />
                                </InputContainer>
                                <InnerContainerRow nopadding nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Sted</InputLabel>
                                        <InputElement type="text" value={entries.location} disabled />
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Avvikende sted</InputLabel>
                                        <InputElement type="text"{...register("newLocation")} value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
                                    </InputContainer>
                                </InnerContainerRow>
                                <InnerContainerRow nopadding nowrap>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Tidspunkt</InputLabel>
                                        <InputElement type="datetime-local" disabled value={new Date(entries.time*1000).toISOString().slice(0, 16)}/>
                                    </InputContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Avvikende tidspunkt</InputLabel>
                                        <InputElement type="datetime-local" {...register("newTime")} required value={newHTMLtime} onChange={(e) => setNewHTMLtime(e.target.value)}/>
                                    </InputContainer>
                                </InnerContainerRow>
                                <InputContainer column extramargin>
                                    <InputLabel small>Begrunnelse for endring</InputLabel>
                                    <InputElement type="text" {...register("modifyReason")} value={modifyReason} onChange={(e) => setModifyReason(e.target.value)}/>
                                </InputContainer>
                            </InnerContainer>

                            <InnerContainer>
                                Parametere:
                                <InputContainer>
                                    <InputElement type="checkbox" {...register("sticky")} checked={sticky} onChange={() => setSticky(!sticky)} />
                                </InputContainer>
                            </InnerContainer>
                            <FormButton type="submit" onClick={handleSubmit(onSubmit)}>Endre</FormButton>
                            <FormButton type="">Slett</FormButton>
                            
                        </InnerContainer>
                    </InnerContainerRow>
                </form>
            </>
        )
    }
} 
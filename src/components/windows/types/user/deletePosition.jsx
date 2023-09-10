import { useForm } from "react-hook-form";
import { InnerContainer, InnerContainerRow, InputButton, InputContainer, InputElement, InputLabel, LabelWarning } from "../../../dashboard"
import { PositionMapping, getCurrentEvent } from "@phoenixlan/phoenix.js";
import { FormButton, FormInput } from "../../../form";
import { useContext, useState } from "react";
import { AuthenticationContext } from "../../../authentication";
import { useEffect } from "react";

export const DeletePosition = ({functions, entries}) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    
    const onSubmit = async (data) => {
        // Get current event so we can get its UUID
        const event = await getCurrentEvent();      

        const dateUnixTime = new Date(data.time);

        try {
            await PositionMapping.deletePositionMapping(entries.uuid)
        } catch(e) {
            console.error("An error occured while attempting to delete the position.\n" + e)
        }
        functions.exitFunction();
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InnerContainerRow>
                    <InnerContainer flex="1">
                        <InnerContainer>
                            Er du sikker på at du vil fjerne denne stillingen?<br />
                            Denne handlingen kan ikke reverseres.
                        </InnerContainer>

                
                        <InnerContainer flex="1" nopadding>
							<InputContainer>
								<InputButton type="submit" onClick={handleSubmit(onSubmit)}>Fjern stilling</InputButton>
							</InputContainer>
                        </InnerContainer>
                    </InnerContainer>
                </InnerContainerRow>
            </form>
        </>
    )
} 
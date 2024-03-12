import { useForm } from "react-hook-form";
import { CardContainer, CardContainerIcon, CardContainerInnerIcon, CardContainerInput, CardContainerInputWrapper, CardContainerSelectInput, CardContainerText, InnerContainer, InnerContainerRow, InnerContainerTitle, InputElement, InputLabel, PanelButton } from "../../../dashboard"
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faCalendar, faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { faMapPin, faPhone } from "@fortawesome/free-solid-svg-icons";
import { User } from "@phoenixlan/phoenix.js";
import { WindowManagerContext } from "../../windowManager";

export const ActivateUser = ({ entries }) => {

	// Inherit WindowManagerContext
    const windowManager = useContext(WindowManagerContext);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const activate = async (data) => {
		try { 
			await User.activateUser(data.uuid);
			windowManager.exitWindow();
		} catch(e) {
			console.error("An error occured while attempting to update the user.\n" + e);
		}
    }
    const cancel = () => {
        windowManager.exitWindow();
    }

	return (
		<>
            <InnerContainerRow flex="1" nopadding>
                <InnerContainer flex="1" nopadding>
                    <InnerContainer flex="1" mobileRowGap="0em" nopadding>
                        <InputElement type="hidden" value={entries.uuid} {...register("uuid")} />
                        <InnerContainerRow mobileNoGap nopadding>
                            <PanelButton type="submit" onClick={handleSubmit(activate)} flex>Aktiver</PanelButton>
                            <PanelButton type="submit" onClick={handleSubmit(cancel)} flex>Avbryt</PanelButton>
                        </InnerContainerRow>
                    </InnerContainer>
                </InnerContainer>
            </InnerContainerRow>
		</>
	)
} 
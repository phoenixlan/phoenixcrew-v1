import { useForm } from "react-hook-form";
import { InnerContainer, InnerContainerRow, InputElement, PanelButton } from "../../../dashboard";
import { useContext } from "react";
import { Avatar } from "@phoenixlan/phoenix.js";
import { WindowManagerContext } from "../../windowManager";

export const DeleteAvatar = ({ entries }) => {

	// Inherit WindowManagerContext
    const windowManager = useContext(WindowManagerContext);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const deleteAvatar = async (data) => {
		try { 
			await Avatar.deleteAvatar(data.avatar_uuid);
			windowManager.exitWindow();
		} catch(e) {
			console.error("An error occured while attempting to delete this users' avatar.\n" + e);
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
                        <InputElement type="hidden" value={entries.avatar_uuid} {...register("avatar_uuid")} />
                        <InnerContainerRow mobileNoGap nopadding>
                            <PanelButton type="submit" onClick={handleSubmit(deleteAvatar)} flex>Bekreft</PanelButton>
                            <PanelButton type="submit" onClick={handleSubmit(cancel)} flex>Avbryt</PanelButton>
                        </InnerContainerRow>
                    </InnerContainer>
                </InnerContainer>
            </InnerContainerRow>
		</>
	)
} 
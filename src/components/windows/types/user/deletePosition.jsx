import { useForm } from "react-hook-form";
import { InnerContainer, InnerContainerRow, InputContainer, InputElement, PanelButton } from "../../../dashboard"
import { PositionMapping, getCurrentEvent } from "@phoenixlan/phoenix.js";
import { WindowManager, WindowManagerContext } from "../../windowManager";
import { Notice } from "../../../containers/notice";
import { useContext, useState } from "react";

export const DeletePosition = ({ entries}) => {

    // Inherit WindowManagerContext
    const windowManager = useContext(WindowManagerContext);

    const { register, handleSubmit, formState: { errors } } = useForm();
    
	// Error handling from API and JS
	const [ error, setError ] = useState(undefined);

    const deleteRole = async () => {
        try {
            await PositionMapping.deletePositionMapping(entries.uuid);
            windowManager.exitWindow();
        } catch(e) {
            setError(e.message);
            console.error("An error occured while attempting to delete the position.\n" + e)
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
                        <Notice visible={error} type="error" title="En feil har oppstått" description={error} />
                        
                        <InputElement type="hidden" value={entries.uuid} {...register("uuid")} />
                        <InnerContainerRow mobileNoGap nopadding>
                            <PanelButton type="submit" onClick={handleSubmit(deleteRole)} flex>Fjern</PanelButton>
                            <PanelButton type="submit" onClick={handleSubmit(cancel)} flex>Avbryt</PanelButton>
                        </InnerContainerRow>
                    </InnerContainer>
                </InnerContainer>
            </InnerContainerRow>
        </>
    )
} 
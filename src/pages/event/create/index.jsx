import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import { AuthenticationContext } from "../../../components/authentication";
import { Notice } from "../../../components/containers/notice";
import {
    CardContainer,
    DashboardContent,
    DashboardHeader,
    DashboardSubtitle,
    DashboardTitle,
    InnerContainer,
    InnerContainerRow,
    InnerContainerTitle,
    InputContainer,
    InputElement,
    InputLabel,
    InputSelect,
    PanelButton,
} from "../../../components/dashboard";
import { PageLoading } from "../../../components/pageLoading";
import { useBrand } from "../../../contexts/brand";
import { useCreateEventMutation } from "../../../hooks/events/useCreateEventMutation";
import { useBrandSeatmaps } from "../../../hooks/seatmaps/useBrandSeatmaps";
import { hasBrandPermission } from "../../../utils/roles";
import { buildEventPayload } from "./eventPayload";

const integerValidation = value => Number.isInteger(Number(value)) || "Må være et heltall";

export const CreateEvent = () => {
    const auth = useContext(AuthenticationContext);
    const { brand, brandUuid, path } = useBrand();
    const history = useHistory();
    const canCreateEvent = hasBrandPermission(auth.roles, brandUuid, "admin");
    const seatmapsQuery = useBrandSeatmaps(canCreateEvent ? brandUuid : null);
    const createEventMutation = useCreateEventMutation(brandUuid);
    const {
        register,
        handleSubmit,
        getValues,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            theme: "",
            start_time: "",
            end_time: "",
            booking_time: "",
            priority_seating_delay: "",
            seating_delay: "",
            max_participants: "",
            participant_age_limit_inclusive: "",
            crew_age_limit_inclusive: "",
            seatmap_uuid: "",
        },
    });

    if(!canCreateEvent) {
        return (
            <DashboardContent>
                <InnerContainerRow>
                    <Notice type="error" visible>
                        Du har ikke tilgang til å opprette nye arrangementer.
                    </Notice>
                </InnerContainerRow>
            </DashboardContent>
        );
    }

    if(seatmapsQuery.isLoading) return <PageLoading />;

    const onSubmit = async data => {
        try {
            const event = await createEventMutation.mutateAsync(buildEventPayload(data));
            history.push(path(`/event/${event.uuid}`));
        } catch(error) {
            // The mutation exposes the error to the notice below.
        }
    };

    const hasValidationErrors = Object.keys(errors).length > 0;
    const eventName = watch("name").trim();
    const seatmaps = seatmapsQuery.data ?? [];

    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>Opprett nytt arrangement</DashboardTitle>
                <DashboardSubtitle>{eventName || brand.name}</DashboardSubtitle>
            </DashboardHeader>

            <DashboardContent as="form" onSubmit={handleSubmit(onSubmit)}>
                <InnerContainer rowgap>
                    <InnerContainerRow visible={hasValidationErrors}>
                        <Notice fillWidth type="error" visible={hasValidationErrors}>
                            Kontroller at alle obligatoriske felt er riktig utfylt.
                        </Notice>
                    </InnerContainerRow>
                    <InnerContainerRow visible={createEventMutation.isError}>
                        <Notice fillWidth type="error" visible={createEventMutation.isError}>
                            Det oppsto en feil ved opprettelse av arrangementet.<br />
                            {createEventMutation.error?.message}
                        </Notice>
                    </InnerContainerRow>
                    <InnerContainerRow visible={seatmapsQuery.isError}>
                        <Notice fillWidth type="warning" visible={seatmapsQuery.isError}>
                            Setekart kunne ikke lastes. Arrangementet kan fortsatt opprettes uten setekart.
                        </Notice>
                    </InnerContainerRow>

                    <InnerContainerRow>
                        <InnerContainer flex="1" floattop>
                            <InnerContainerTitle>Arrangementsinformasjon</InnerContainerTitle>
                            <InnerContainerRow nowrap>
                                <CardContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Navn</InputLabel>
                                        <InputElement
                                            type="text"
                                            {...register("name", {
                                                required: true,
                                                validate: value => !!value.trim(),
                                            })}
                                        />
                                    </InputContainer>
                                </CardContainer>
                            </InnerContainerRow>
                            <InnerContainerRow nowrap>
                                <CardContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Tema</InputLabel>
                                        <InputElement type="text" {...register("theme")} />
                                    </InputContainer>
                                </CardContainer>
                            </InnerContainerRow>

                            <InnerContainerTitle>Billetter og aldersgrenser</InnerContainerTitle>
                            <InnerContainerRow nowrap>
                                <CardContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Antall plasser</InputLabel>
                                        <InputElement
                                            type="number"
                                            min="1"
                                            step="1"
                                            {...register("max_participants", {
                                                required: true,
                                                min: 1,
                                                validate: integerValidation,
                                            })}
                                        />
                                    </InputContainer>
                                </CardContainer>
                            </InnerContainerRow>
                            <InnerContainerRow nowrap>
                                <CardContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Øvre aldersgrense for deltakere</InputLabel>
                                        <InputElement
                                            type="number"
                                            min="0"
                                            step="1"
                                            {...register("participant_age_limit_inclusive", {
                                                min: 0,
                                                validate: value => value === "" || integerValidation(value),
                                            })}
                                        />
                                    </InputContainer>
                                </CardContainer>
                                <CardContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Øvre aldersgrense for crew</InputLabel>
                                        <InputElement
                                            type="number"
                                            min="0"
                                            step="1"
                                            {...register("crew_age_limit_inclusive", {
                                                min: 0,
                                                validate: value => value === "" || integerValidation(value),
                                            })}
                                        />
                                    </InputContainer>
                                </CardContainer>
                            </InnerContainerRow>
                        </InnerContainer>

                        <InnerContainer flex="1" floattop>
                            <InnerContainerTitle>Arrangementstid og booking</InnerContainerTitle>
                            <InnerContainerRow nowrap>
                                <CardContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Arrangementstid start</InputLabel>
                                        <InputElement type="datetime-local" {...register("start_time", { required: true })} />
                                    </InputContainer>
                                </CardContainer>
                                <CardContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Arrangementstid slutt</InputLabel>
                                        <InputElement
                                            type="datetime-local"
                                            {...register("end_time", {
                                                required: true,
                                                validate: value => !getValues("start_time") || new Date(value) > new Date(getValues("start_time")),
                                            })}
                                        />
                                    </InputContainer>
                                </CardContainer>
                            </InnerContainerRow>
                            <InnerContainerRow nowrap>
                                <CardContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Billettslipp</InputLabel>
                                        <InputElement type="datetime-local" {...register("booking_time", { required: true })} />
                                    </InputContainer>
                                </CardContainer>
                            </InnerContainerRow>
                            <InnerContainerRow nowrap>
                                <CardContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Prioritert seating etter billettslipp (minutter)</InputLabel>
                                        <InputElement
                                            type="number"
                                            min="0"
                                            step="1"
                                            {...register("priority_seating_delay", {
                                                required: true,
                                                min: 0,
                                                validate: integerValidation,
                                            })}
                                        />
                                    </InputContainer>
                                </CardContainer>
                                <CardContainer>
                                    <InputContainer column extramargin>
                                        <InputLabel small>Normal seating etter billettslipp (minutter)</InputLabel>
                                        <InputElement
                                            type="number"
                                            min="0"
                                            step="1"
                                            {...register("seating_delay", {
                                                required: true,
                                                min: 0,
                                                validate: integerValidation,
                                            })}
                                        />
                                    </InputContainer>
                                </CardContainer>
                            </InnerContainerRow>

                            <InnerContainerTitle>Setekart</InnerContainerTitle>
                            <InnerContainerRow nowrap>
                                <CardContainer>
                                    <InputContainer column extramargin disabled={seatmapsQuery.isError}>
                                        <InputLabel small>Setekart</InputLabel>
                                        <InputSelect {...register("seatmap_uuid")} disabled={seatmapsQuery.isError}>
                                            <option value="">Ingen setekart</option>
                                            {seatmaps.map(seatmap => (
                                                <option key={seatmap.uuid} value={seatmap.uuid}>{seatmap.name}</option>
                                            ))}
                                        </InputSelect>
                                    </InputContainer>
                                </CardContainer>
                            </InnerContainerRow>
                        </InnerContainer>
                    </InnerContainerRow>

                    <InnerContainerRow>
                        <InnerContainer flex="1">
                            <CardContainer>
                                <PanelButton fillWidth type="submit" disabled={createEventMutation.isLoading}>
                                    {createEventMutation.isLoading ? "Oppretter …" : "Opprett"}
                                </PanelButton>
                            </CardContainer>
                            <CardContainer>
                                <PanelButton fillWidth type="button" onClick={() => history.push(path("/events/"))}>
                                    Avbryt
                                </PanelButton>
                            </CardContainer>
                        </InnerContainer>
                        <InnerContainer flex="1" />
                    </InnerContainerRow>
                </InnerContainer>
            </DashboardContent>
        </>
    );
};

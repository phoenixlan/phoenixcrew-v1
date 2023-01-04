import React , { useEffect, useState, useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import { Seatmap } from "@phoenixlan/phoenix.js";
import { Table, SelectableRow, Column, TableHeader, IconContainer } from "../../components/table";
import { DashboardHeader, DashboardContent, DashboardTitle, DashboardSubtitle, InnerContainer, InnerContainerRow, InnerContainerTitle, InputLabel, InputElement, InputContainer } from "../../components/dashboard";
import { PageLoading } from "../../components/pageLoading";
import { FormButton } from '../../components/form';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export const SeatmapList = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const printRef = useRef();
    const [seatmaps, setSeatmaps] = useState([]);
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [visibleUUID, setVisibleUUID] = useState(false);

    const loadSeatmaps = async () => {
        const seatmapList = await Seatmap.getSeatmaps();
        setSeatmaps(seatmapList);
    }

    useEffect(async () => {
        await loadSeatmaps();
        setLoading(false);
    }, []);

    const onSubmit = async (data) => {
        if(!await Seatmap.createSeatmap(data.name, data.description)) {
            console.log("Fucked up");
        }
        await loadSeatmaps();
    }

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });


    if(loading) {
        return (
            <PageLoading />
        )
    }

    else {
        return (
            <>
                <DashboardHeader border>
                    <DashboardTitle>
                        Setekart
                    </DashboardTitle>
                    <DashboardSubtitle>
                        {seatmaps.length} setekart tilgjengelige
                    </DashboardSubtitle>
                </DashboardHeader>
                <DashboardContent>
                    <InnerContainer>
                        Setekart er hvordan brukere med billett kan reservere en plass på arrangementet.<br/>
                        Det inneholder en visuell/skjematisk plan av deltakerområdet med seteplasser som brukere kan reservere.
                    </InnerContainer>
                    <InnerContainerRow >
                        <InnerContainer flex="2">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <InnerContainerTitle>
                                    Opprett et nytt setekart
                                </InnerContainerTitle>
                                <InputContainer column extramargin>
                                    <InputLabel small>Setekart navn</InputLabel>
                                    <InputElement type="text" {...register("name")} />
                                </InputContainer>
                                <InputContainer column extramargin>
                                    <InputLabel small>Beskrivelse</InputLabel>
                                    <InputElement type="text" {...register("description")} />
                                </InputContainer>
                                <InputContainer column extramargin>
                                    <FormButton type="submit">Opprett setekart</FormButton>
                                </InputContainer>
                            </form>
                        </InnerContainer>
                        <InnerContainer flex="1" />
                        <InnerContainer flex="4">
                            { /* Eventuelle innstillinger kan legges her */ }
                        </InnerContainer>
                    </InnerContainerRow>
                    
                    <InnerContainer>
                        <Table>
                            <TableHeader border>
                                    <Column consolas flex="4" visible={!visibleUUID}>UUID</Column>
                                    <Column flex="4">Navn</Column>
                                    <Column flex="5">Beskrivelse</Column>
                                    <Column center flex="0 24px" title="Trykk for å åpne"><IconContainer>...</IconContainer></Column>
                            </TableHeader>
                            {
                                seatmaps.map((seatmap) => {
                                    return (
                                        <SelectableRow title="Trykk for å åpne" onClick={e => {history.push(`/seatmap/${seatmap.uuid}`)}}>
                                            <Column consolas flex="4" visible={!visibleUUID}>{ seatmap.uuid }</Column>
                                            <Column flex="4">{ seatmap.name }</Column>
                                            <Column flex="5">{ seatmap.description }</Column>
                                            <Column flex="0 24px" center><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></Column>
                                        </SelectableRow>
                                    )
                                })
                            }
                        </Table>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
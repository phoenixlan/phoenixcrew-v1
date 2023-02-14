import React , { useEffect, useState, useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import { Seatmap } from "@phoenixlan/phoenix.js";
import { Table, SelectableTableRow, TableCell, TableHead, IconContainer, TableRow, TableBody } from "../../components/table";
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

                    <InnerContainer>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <InnerContainerTitle>
                                Opprett et nytt setekart
                            </InnerContainerTitle>

                            <InnerContainerRow>
                                <InnerContainer flex="1">
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
                                </InnerContainer>
                                <InnerContainer flex="1" mobileHide />
                                <InnerContainer flex="1" mobileHide>
                                    { /* Eventuelle innstillinger kan legges her */ }
                                </InnerContainer>
                            </InnerContainerRow>
                        </form>
                    </InnerContainer>
                    
                    <InnerContainer>
                        <Table>
                            <TableHead border>
                                <TableRow>
                                    <TableCell as="th" consolas flex="4" mobileHide visible={!visibleUUID}>UUID</TableCell>
                                    <TableCell as="th" flex="4" mobileFlex="4">Navn</TableCell>
                                    <TableCell as="th" flex="5" mobileFlex="3">Beskrivelse</TableCell>
                                    <TableCell as="th" center flex="0 24px" mobileHide title="Trykk for å åpne"><IconContainer>...</IconContainer></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    seatmaps.map((seatmap) => {
                                        return (
                                            <SelectableTableRow title="Trykk for å åpne" onClick={e => {history.push(`/seatmap/${seatmap.uuid}`)}}>
                                                <TableCell consolas flex="4" mobileHide visible={!visibleUUID}>{ seatmap.uuid }</TableCell>
                                                <TableCell flex="4" mobileFlex="4">{ seatmap.name }</TableCell>
                                                <TableCell flex="5" mobileFlex="3">{ seatmap.description }</TableCell>
                                                <TableCell flex="0 24px" mobileHide center><IconContainer><FontAwesomeIcon icon={faArrowRight}/></IconContainer></TableCell>
                                            </SelectableTableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </InnerContainer>
                </DashboardContent>
            </>
        )
    }
}
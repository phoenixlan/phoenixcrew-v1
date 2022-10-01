import React , { useEffect, useState, useRef } from "react";
import { useReactToPrint } from 'react-to-print';

import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';

import styled from "styled-components";

import { Seatmap } from "@phoenixlan/phoenix.js";

import { FormContainer, FormEntry, FormLabel, FormInput, FormError } from '../../components/form';
import { TableLabels } from './tableLabels'

const S = {
    Seatmap: styled.div`
    
    `
}

export const SeatmapList = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const printRef = useRef();
    const [seatmaps, setSeatmaps] = useState([]);
    const history = useHistory();
    const [printUuid, setPrintUuid] = useState(null)

    const loadSeatmaps = async () => {
        const seatmapList = await Seatmap.getSeatmaps();
        setSeatmaps(seatmapList);
    }

    useEffect(async () => {
        await loadSeatmaps();
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

    return (<div>
        <TableLabels ref={printRef} uuid={printUuid}/>
        <h1>Seatmaps</h1>
        {
            seatmaps.map((seatmap) => {
                return (<S.Seatmap key={seatmap.uuid}>
                    <h1>{seatmap.name}</h1>
                    <p>{seatmap.description}</p>
                    <button onClick={() => {history.push(`/seatmap/${seatmap.uuid}`)}}>Rediger</button>
                        <button onClick={() => { setPrintUuid(seatmap.uuid); handlePrint()}}>Print this out!</button>

                </S.Seatmap>)
            })
        }
        <h1>Nytt seatmap</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormContainer>
                <FormEntry>
                    <FormLabel>Navn</FormLabel>
                    <FormInput {...register("name")}></FormInput>
                    {errors.name && <FormError>Navn er påkrevd</FormError>}
                </FormEntry>
                <FormEntry>
                    <FormLabel>Beskrivelse</FormLabel>
                    <FormInput {...register("description")}></FormInput>
                    {errors.description && <FormError>Beskrivelse er påkrevd</FormError>}
                </FormEntry>
                <FormEntry>
                    <FormInput type="submit"></FormInput>
                </FormEntry>
            </FormContainer>
        </form>
        </div>)
}
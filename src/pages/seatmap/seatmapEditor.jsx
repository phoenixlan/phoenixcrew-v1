import React, { useEffect, useState } from "react";
import { useParams} from 'react-router-dom';
import styled from "styled-components";

import Spinner from "react-svg-spinner";

import { Seatmap, Entrance, TicketType, Row } from '@phoenixlan/phoenix.js'

import { ContentContainer } from "../../components/content";

const S = {
    SeatmapCanvas: styled.div`
    position: relative;
    border: 1px solid;
    width: ${props => props.canvasWidth}px;
    height: ${props => props.canvasHeight}px;

    ${props => props.background ? 'background-image: url("' + props.background + '");'  : ""}
    `,
    Toolbar: styled.div`
    height: 2em;
    margin: 1em 0em 1em 0em;
    `,
    ToolbarForm: styled.form`
    height: 100%;
    display: inline;
    `,
    ToolbarButton: styled.button`
    height: 100%;
    `,
    ToolbarSelect: styled.select`
    height: 100%;
    `,
    ToolbarInputSmall: styled.input`
    height: 100%;
    width: 3em;
    `,
    ToolbarInput: styled.input`
    height: 100%;
    `,
    ToolbarSeparator: styled.span`
    margin: 0em 0.2em 0em 0.2em;
    border: 1px solid;
    width: 1px;
    height: 100%;
    `,
    Row: styled.div`
    width: 32px;
    position: absolute;
    ${(props) => props.active ? "background-color: gray; padding: 4px;" : ""}

    top: ${(props) => (props.active ? props.y - 4 : props.y)}px;
    left: ${(props) => (props.active ? props.x - 4 : props.x)}px;

    cursor: pointer;
    `,
    Seat: styled.div`
    width: 27px;
    height: 27px;

    padding: 2px;
    margin: 1px;

    font-size: 10px;

    text-align: center;
    font-family: arial;
	display: inline-block;
    
    background-color: green;
    `
}

const RowElement = ({ row, setActiveRow, active }) => {
    return (<S.Row x={row.x} y={row.y} onClick={() => setActiveRow(row.uuid)} active={active}>
        {row.seats.length == 0 ? (
            <span>R{row.row_number}</span>
        ):(
            row.seats.map((seat) => {
                return (<S.Seat key={seat.number}>
                    <span>R{row.row_number}</span><br />
                    <span>S{seat.number}</span>
                    </S.Seat>)
            })
        )}
    </S.Row>)
}

export const SeatmapEditor = () => {
    const { uuid } = useParams();
    const [ seatmap, setSeatmap ] = useState(null);
    const [ entrances, setEntrances ] = useState([]);
    const [ ticketTypes, setTicketTypes ] = useState([]);
    const [ activeRow, setActiveRow ] = useState(null);

    const [ rowX, setRowX ] = useState(0);
    const [ rowY, setRowY ] = useState(0);
    const [ rowNumber, setRowNumber ] = useState(0);
    const [ isHorizontal, setIsHorizontal ] = useState(false);

    const [ entranceUuid, setEntranceUuid ] = useState("");
    const [ ticketTypeUuid, setTicketTypeUuid ] = useState("");

    const [ selectedBackgroundFile, setSelectedBackgroundFile ] = useState(null);

    const [ loading, setLoading ] = useState(true);

    const inputChange = (data) => {
        switch(data.target.name) {
            case "horizontal":
                setIsHorizontal(data.target.checked);
                break;
            case "x":
                setRowX(data.target.valueAsNumber);
                break;
            case "y":
                setRowY(data.target.valueAsNumber);
                break;
            case "rowNumber":
                setRowNumber(data.target.valueAsNumber);
                break;
            case "entrance":
                setEntranceUuid(data.target.value);
                break;
            case "ticketType":
                setTicketTypeUuid(data.target.value);
                break;
            default:
                throw `${data.target.name} is not valid`;
        }
    }

    const loadEntrances = async () => {
        const entrances = await Entrance.getEntrances();
        setEntrances(entrances);
    }
    const loadTicketTypes = async () => {
        const ticketTypes = await TicketType.getTicketTypes();
        setTicketTypes(ticketTypes);
    }

    const refreshSeatmap = async () => {
        setLoading(true);
        const seatmap = await Seatmap.getSeatmap(uuid);
        setSeatmap(seatmap);
        setLoading(false);
    }

    useEffect(async () => {
        await loadEntrances();
        await loadTicketTypes();
        await refreshSeatmap();
    }, []);

    const newRow = async () => {
        setLoading(true);
        const success = await Seatmap.addRow(
            seatmap.uuid,
            Number.parseInt(rowNumber),
            Number.parseInt(rowX),
            Number.parseInt(rowY),
            isHorizontal,
            entranceUuid == "" ? undefined : entranceUuid,
            ticketTypeUuid == "" ? undefined :ticketTypeUuid 
        );
        await refreshSeatmap();
    }

    const moveRow = async (data) => {
        console.log(data);
        const success = await Row.updateRow(activeRow, {
            x: rowX,
            y: rowY,
            is_horizontal: isHorizontal,
            row_number: rowNumber
        })
        await refreshSeatmap();
        
    }

    const newSeat = async () => {
        await Row.addSeat(activeRow);
        await refreshSeatmap();
    }

    const setActiveRowWrapper = (uuid) => {
        const row = seatmap.rows.filter((row) => row.uuid === uuid)[0]
        setActiveRow(uuid);
        setRowX(row.x);
        setRowY(row.y);
        setRowNumber(row.row_number);
        setEntranceUuid(row.entrance_uuid??"");
        setTicketTypeUuid(row.ticket_type_uuid??"");
    }

    const onBackgroundSelect = (event) => {
        console.log(event.target);
        setSelectedBackgroundFile(event.target.files[0])
    }

    const uploadFile = async () => {
        console.log(selectedBackgroundFile);
        const formData = new FormData();
        formData.append("file", selectedBackgroundFile);
        setLoading(true);
        await Seatmap.uploadBackground(uuid, formData);
        await refreshSeatmap();
    }

    return (<ContentContainer>
    <h1>Editor: {uuid}</h1>
    <p>Active row: {activeRow}</p>
    {
        loading ? <Spinner /> : (
            <>
                <S.Toolbar>
                    <span>Background image:</span>
                    <S.ToolbarInput type='file' onChange={onBackgroundSelect}/>
                    {
                        selectedBackgroundFile ? (
                            <S.ToolbarButton onClick={uploadFile}>Upload</S.ToolbarButton>
                        ) : null
                    }
                </S.Toolbar>
                <S.Toolbar>
                    <S.ToolbarButton onClick={newRow}>New row</S.ToolbarButton>
                    <S.ToolbarSelect name="entrance" onChange={inputChange} value={entranceUuid}>
                        <option key={""} value={""}>Ingen spesifik inngang</option>
                        {
                            entrances.map((entrance) => {
                                return (<option key={entrance.uuid} value={entrance.uuid}>{entrance.name}</option>)
                            })
                        }
                    </S.ToolbarSelect>
                    <S.ToolbarSelect name="ticketType" onChange={inputChange} value={ticketTypeUuid}>
                        <option key={""} value={""}>Fritt for alle</option>
                        {
                            ticketTypes.map((ticketType) => {
                                return (<option key={ticketType.uuid} value={ticketType.uuid}>{ticketType.name}</option>)
                            })
                        }
                    </S.ToolbarSelect>
                    <span>Horizontal</span>
                    <S.ToolbarInput type="checkbox" name='horizontal' onChange={inputChange} checked={isHorizontal}/>
                    <span>Row number</span>
                    <S.ToolbarInputSmall type="number" name='rowNumber' onChange={inputChange} value={rowNumber}/>
                    <span>X</span>
                    <S.ToolbarInputSmall type="number" name='x' onChange={inputChange} value={rowX}/>
                    <span>Y</span>
                    <S.ToolbarInputSmall type="number" name='y' onChange={inputChange} value={rowY}/>
                </S.Toolbar>
                {
                    activeRow ? (
                        <S.Toolbar>
                            <S.ToolbarButton onClick={newSeat}>New seat</S.ToolbarButton>
                            <S.ToolbarInput type="submit" value="Modify row" onClick={moveRow}/>
                        </S.Toolbar>
                    ) : null
                }
                <S.SeatmapCanvas background={seatmap.background ? seatmap.background.url : null} canvasWidth={seatmap.width} canvasHeight={seatmap.height}>
                    {
                        seatmap.rows.map((row) => <RowElement key={row.uuid} row={row} setActiveRow={setActiveRowWrapper} active={row.uuid == activeRow}/>)
                    }
                </S.SeatmapCanvas>
            </>
        )
    }
    </ContentContainer>)
}
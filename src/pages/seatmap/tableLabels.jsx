import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Seatmap } from '@phoenixlan/phoenix.js';

import Logo from "../../assets/logo.svg"

const S = {
    PrintWrapper:  styled.div`
    @media screen {
        display: none;
    }
    `,
    Seat: styled.div`
    text-align: center;
    `,
    Name: styled.div`
    margin-top: -39px;
	font-size: 70px;
	font-family: Arial;
	font-weight: bold;
    `,
    SeatTitle: styled.div`
    font-size: 50px;
	margin-bottom: 450px;
    `,
    Logo: styled.img`
    display: block;
    height: 300px;
    margin: auto;
    `,
    LogoHackInner: styled.div`
    height: 4em;
    `,
    LogoHack: styled.div`
    margin: auto;
    `
}

export const TableLabels = React.forwardRef(({uuid}, ref) => {
    const [ availability, setAvailability ] = useState(null)

    useEffect(async () => {
        const availability = await Seatmap.getSeatmapAvailability(uuid);
        console.log(availability);
        setAvailability(availability)
    }, [uuid])
    console.log(uuid)

    return (<S.PrintWrapper ref={ref}>
        {
            availability ? (availability.rows.map((row) => row.seats.map(seat => (
                <S.Seat>
                    <S.Name>
                        <S.LogoHack>
                            <S.LogoHackInner />
                            <S.Logo src={Logo} />
                        </S.LogoHack>
                        { seat.owner ? `${seat.owner.firstname} ${seat.owner.lastname}` : (<b>Ledig plass!</b>) }
                    </S.Name>
                    <S.SeatTitle>R{row.row_number} S{seat.number}
                    </S.SeatTitle>
                </S.Seat>
            ))
                
            )) : (<h1>Waiting</h1>)
        }

    </S.PrintWrapper>)
})
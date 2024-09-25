import React, { useState, useEffect } from "react";

import { Line } from 'react-chartjs-2';

import { DashboardSubtitle, DashboardHeader, DashboardTitle, DashboardContent, InnerContainer, InputCheckbox } from "../../components/dashboard";
import { PageLoading } from "../../components/pageLoading";

import { Statistics } from "@phoenixlan/phoenix.js"


export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Billettsalg',
        },
    },
};

// Takes a list of something, runs a callback on each value, returns the one with the highest value
const mostest = (list, callback) => {
    let soFar = 0;
    let soFarI = 0;
    for(let i = 0; i < list.length; i++) {
        const val = callback(list[i])
        if(val > soFar) {
            soFarI = i;
            soFar = val
        }
    }
    return list[soFarI];
}

export const TicketSalesStats = () => {

    const [ stats, setStats ] = useState({ datasets: [] })
    const [ showFree, setShowFree ] = useState(false);
    const [ loading, setLoading] = useState(true);

    useEffect(() => {
        const inner = async () => {
            setLoading(true)
            const salesData = await Statistics.getTicketSaleData(showFree);

            const labels = mostest(salesData.map(event => event.days.map(day => day.idx)), (value) => value.length);

            const data = {
                labels,
                datasets: salesData.map((salesEvent) => {
                    const cumulativeSum = (sum => value => sum += value)(0);
                    return {
                        label: salesEvent.event.name,
                        data: salesEvent.days.map((day) => day.count).map(cumulativeSum)
                    }
                })
            };

            setStats(data)
            setLoading(false)
        }
        inner();
    }, [showFree]);

    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Billettsalg
                </DashboardTitle>
                <DashboardSubtitle>
                    Viser billettsalg for hvert arrangement igjennom tidene
                </DashboardSubtitle>
            </DashboardHeader>
            <DashboardContent>
                <InnerContainer mobileHide>
                    <InputCheckbox label="Ta med gratisbilletter" value={showFree} onChange={() => setShowFree(!showFree)} />
                </InnerContainer>
            </DashboardContent>
            <DashboardContent>
                {
                    loading ? (<PageLoading />) : (<Line options={options} data={stats} />)
                }
            </DashboardContent>
        </>
    )
}
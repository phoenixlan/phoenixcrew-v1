import React, { useMemo, useState } from "react";

import { Line } from 'react-chartjs-2';

import { DashboardSubtitle, DashboardHeader, DashboardTitle, DashboardContent, InnerContainer, InputCheckbox } from "../../components/dashboard";
import { PageLoading } from "../../components/pageLoading";

import { useTicketSaleData } from "../../hooks/stats/useTicketSaleData";


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
    const [ showFree, setShowFree ] = useState(false);
    const { data: salesData, isLoading } = useTicketSaleData(showFree);

    const stats = useMemo(() => {
        if (!salesData) {
            return { datasets: [] };
        }

        const labels = mostest(salesData.map(event => event.days.map(day => day.idx)), (value) => value.length);

        return {
            labels,
            datasets: salesData.map((salesEvent) => {
                const cumulativeSum = (sum => value => sum += value)(0);
                return {
                    label: salesEvent.event.name,
                    data: salesEvent.days.map((day) => day.count).map(cumulativeSum)
                }
            })
        };
    }, [salesData]);

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
                    isLoading ? (<PageLoading />) : (<Line options={options} data={stats} />)
                }
            </DashboardContent>
        </>
    )
}

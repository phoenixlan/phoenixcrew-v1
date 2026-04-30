import React, { useMemo } from "react";

import { Bar } from 'react-chartjs-2';

import { DashboardSubtitle, DashboardHeader, DashboardTitle, DashboardContent, InnerContainer, InputCheckbox } from "../../components/dashboard";
import { PageLoading } from "../../components/pageLoading";

import { useUserbaseStatistics } from "../../hooks/stats/useUserbaseStatistics";

export const user_participation_options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Tidligere deltakelse blant brukere',
        },
    },
};

export const crew_participation_options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Tidligere deltakelse blant crew-medlemmer',
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

const generate_stat_data = (userbaseStats, event_count_callback) => {
    const mostest_labels = mostest(userbaseStats.map(event_count_callback), l => l.length)

    const labels = Array.from(mostest_labels.keys())

    const datasets = userbaseStats.map((salesEvent) => {
        return {
            label: salesEvent.event.name,
            data: event_count_callback(salesEvent)
        }
    })

    return {
        labels,
        datasets
    };
}

export const UserbaseStats = () => {
    const { data: userbaseStats, isLoading } = useUserbaseStatistics();

    const userStats = useMemo(
        () => userbaseStats
            ? generate_stat_data(userbaseStats, (salesEvent) => salesEvent.counts)
            : { datasets: [] },
        [userbaseStats]
    );

    const crewStats = useMemo(
        () => userbaseStats
            ? generate_stat_data(userbaseStats, (salesEvent) => salesEvent.crew_counts)
            : { datasets: [] },
        [userbaseStats]
    );

    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Brukerbase
                </DashboardTitle>
                <DashboardSubtitle>
                    Viser informasjon om brukerne våres
                </DashboardSubtitle>
            </DashboardHeader>
            <DashboardContent>
                {
                    isLoading ? (<PageLoading />) : (<>
                        <Bar options={user_participation_options} data={userStats} />
                        <Bar options={crew_participation_options} data={crewStats} />
                    </>)
                }
            </DashboardContent>
        </>
    )
}

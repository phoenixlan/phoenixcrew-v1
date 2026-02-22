import React from "react";

import { Bar } from 'react-chartjs-2';

import { DashboardSubtitle, DashboardHeader, DashboardTitle, DashboardContent } from "../../components/dashboard";
import { PageLoading } from "../../components/pageLoading";

import { useAgeDistribution } from "../../hooks/useStatistics";

export const user_distribution_options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Aldersfordeling(brukere)',
        },
    },
};

export const crew_distribution_options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Aldersfordeling(crew)',
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
    console.log(userbaseStats);
    const mostest_labels = mostest(userbaseStats.map(event_count_callback), l => l.length)
    console.log(mostest_labels)

    const labels = Array.from(mostest_labels.keys())

    const datasets = userbaseStats.map((salesEvent) => {
        return {
            label: salesEvent.event.name,
            data: event_count_callback(salesEvent)
        }
    })
    console.log(datasets);

    return {
        labels,
        datasets
    };
}

export const AgeDistributionStats= () => {
    const { data: ageDistributionStats, isLoading } = useAgeDistribution();

    const userStats = ageDistributionStats ? generate_stat_data(ageDistributionStats, (salesEvent) => salesEvent.age_distribution) : { datasets: [] };
    const crewStats = ageDistributionStats ? generate_stat_data(ageDistributionStats, (salesEvent) => salesEvent.crew_age_distribution) : { datasets: [] };

    return (
        <>
            <DashboardHeader border>
                <DashboardTitle>
                    Alders-fordeling
                </DashboardTitle>
                <DashboardSubtitle>
                    Viser informasjon om hvor gamle deltakerne var på forskjellige LAN
                </DashboardSubtitle>
            </DashboardHeader>
            <DashboardContent>
                {
                    isLoading ? (<PageLoading />) : (<>
                        <Bar options={user_distribution_options} data={userStats} />
                        <Bar options={crew_distribution_options} data={crewStats} />
                    </>)
                }
            </DashboardContent>
        </>
    )
}

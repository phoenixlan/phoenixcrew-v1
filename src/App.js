import React from 'react';

import { Authentication } from './components/authentication';

import { CrewRouter } from './router';

// For charts
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    BarElement,
    Tooltip,
    Legend,
    Colors
} from 'chart.js';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Colors
);

function App() {

    return (
        <>
            <Authentication>
                <CrewRouter />
            </Authentication>
        </>
    );
}

export default App;
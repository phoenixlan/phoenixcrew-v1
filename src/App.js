import React from 'react';

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
            <CrewRouter />
        </>
    );
}

export default App;
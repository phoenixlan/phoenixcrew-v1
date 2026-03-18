import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
            <CrewRouter />
        </QueryClientProvider>
    );
}

export default App;
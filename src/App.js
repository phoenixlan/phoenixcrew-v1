import React from 'react';

import { Authentication } from './components/authentication';

import { CrewRouter } from './router';

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
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useReducer, useEffect } from 'react';
import { Container, Title, SimpleGrid, Loader, Alert, Center, Box } from '@mantine/core';
import { launchesReducer, initialState } from './reducer/launchesReducer';
import { LaunchCard } from './components/LaunchCard';
import { ModalPortal } from './components/ModalPortal';
import classes from './App.module.css';
function extractLaunchesArray(data) {
    if (Array.isArray(data)) {
        return data;
    }
    if (data && typeof data === 'object') {
        const obj = data;
        if (Array.isArray(obj.docs))
            return obj.docs;
        if (Array.isArray(obj.data))
            return obj.data;
        if (Array.isArray(obj.launches))
            return obj.launches;
    }
    return null;
}
async function fetchLaunches() {
    const response = await fetch('https://kata-spacex.onrender.com/api/launches');
    if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();
    const launches = extractLaunchesArray(data);
    if (!launches) {
        throw new Error('Invalid data format');
    }
    return launches;
}
export function App() {
    const [state, dispatch] = useReducer(launchesReducer, initialState);
    useEffect(() => {
        dispatch({ type: 'FETCH_START' });
        fetchLaunches()
            .then((launches) => dispatch({ type: 'FETCH_SUCCESS', payload: launches }))
            .catch((err) => dispatch({ type: 'FETCH_ERROR', payload: err.message }));
    }, []);
    const hasLaunches = state.launches.length > 0;
    return (_jsxs(Container, { size: "lg", className: classes.container, children: [_jsx(Title, { order: 1, ta: "center", className: classes.title, children: "SpaceX Launches 2020" }), state.loading && (_jsx(Center, { className: classes.loaderWrapper, children: _jsx(Loader, { size: "lg" }) })), state.error && (_jsx(Alert, { color: "red", title: "Error", children: state.error })), !state.loading && !state.error && (_jsx(_Fragment, { children: hasLaunches ? (_jsx(SimpleGrid, { cols: { base: 1, sm: 2, md: 3 }, spacing: "lg", children: state.launches.map((launch) => (_jsx(LaunchCard, { launch: launch, onSelect: (item) => dispatch({ type: 'SELECT_LAUNCH', payload: item }) }, `${launch.flight_number}-${launch.mission_name}`))) })) : (_jsx(Box, { ta: "center", className: classes.emptyText, children: "No launches found." })) })), state.selectedLaunch && (_jsx(ModalPortal, { launch: state.selectedLaunch, onClose: () => dispatch({ type: 'CLOSE_MODAL' }) }))] }));
}

import { useReducer, useEffect } from 'react';
import { Container, Title, SimpleGrid, Loader, Alert, Center, Box } from '@mantine/core';
import { launchesReducer, initialState } from './reducer/launchesReducer';
import { LaunchCard } from './components/LaunchCard';
import { ModalPortal } from './components/ModalPortal';
import classes from './App.module.css';

function extractLaunchesArray(data: unknown): Launch[] | null {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.docs)) return obj.docs as Launch[];
    if (Array.isArray(obj.data)) return obj.data as Launch[];
    if (Array.isArray(obj.launches)) return obj.launches as Launch[];
  }

  return null;
}

async function fetchLaunches(): Promise<Launch[]> {
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
      .catch((err: Error) => dispatch({ type: 'FETCH_ERROR', payload: err.message }));
  }, []);

  const hasLaunches = state.launches.length > 0;

  return (
    <Container size="lg" className={classes.container}>
      <Title order={1} ta="center" className={classes.title}>
        SpaceX Launches 2020
      </Title>

      {state.loading && (
        <Center className={classes.loaderWrapper}>
          <Loader size="lg" />
        </Center>
      )}

      {state.error && (
        <Alert color="red" title="Error">
          {state.error}
        </Alert>
      )}

      {!state.loading && !state.error && (
        <>
          {hasLaunches ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
              {state.launches.map((launch) => (
                <LaunchCard
                  key={`${launch.flight_number}-${launch.mission_name}`}
                  launch={launch}
                  onSelect={(item) => dispatch({ type: 'SELECT_LAUNCH', payload: item })}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Box ta="center" className={classes.emptyText}>
              No launches found.
            </Box>
          )}
        </>
      )}

      {state.selectedLaunch && (
        <ModalPortal
          launch={state.selectedLaunch}
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        />
      )}
    </Container>
  );
}
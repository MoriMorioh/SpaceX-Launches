import { useReducer, useEffect } from 'react';
import { Container, Title, SimpleGrid, Loader, Alert, Center } from '@mantine/core';
import { launchesReducer, initialState } from './reducer/launchesReducer';
import { LaunchCard } from './components/LaunchCard';
import { ModalPortal } from './components/ModalPortal';

export function App() {
  const [state, dispatch] = useReducer(launchesReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'FETCH_START' });
    fetch('https://kata-spacex.onrender.com/api/launches')
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const launchesArray = Array.isArray(data)
          ? data
          : Array.isArray(data?.docs)
            ? data.docs
            : Array.isArray(data?.data)
              ? data.data
              : Array.isArray(data?.launches)
                ? data.launches
                : null;
                
        if (launchesArray) {
          dispatch({ type: 'FETCH_SUCCESS', payload: launchesArray });
        } else {
          console.error('Data Error');
          throw new Error('Invalid data format received from API');
        }
      })
      .catch((err) => dispatch({ type: 'FETCH_ERROR', payload: err.message }));
  }, []);

  return (
    <Container size="lg" py="xl">
      <Title order={1} ta="center" mb="xl">
        SpaceX Launches 2020
      </Title>

      {state.loading && (
        <Center py="xl">
          <Loader size="lg" />
        </Center>
      )}

      {state.error && (
        <Alert color="red" title="Error">
          {state.error}
        </Alert>
      )}

      {!state.loading && !state.error && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {(state.launches || []).map((launch) => (
            <LaunchCard
              key={`${launch.flight_number}-${launch.mission_name}`}
              launch={launch}
              onSelect={(item) =>
                dispatch({ type: 'SELECT_LAUNCH', payload: item })
              }
            />
          ))}
        </SimpleGrid>
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

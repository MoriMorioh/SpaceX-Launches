import React, { useState } from 'react';
import { Card, Image, Text, Button, Center, Stack } from '@mantine/core';
import classes from './LaunchCard.module.css';

interface LaunchCardProps {
  launch: Launch;
  onSelect: (launch: Launch) => void;
}

export const LaunchCard: React.FC<LaunchCardProps> = ({ launch, onSelect }) => {
  const rawUrl = launch.links?.mission_patch_small || launch.links?.mission_patch || null;

  const [prevRawUrl, setPrevRawUrl] = useState<string | null>(rawUrl);
  const [hasError, setHasError] = useState(false);

  if (prevRawUrl !== rawUrl) {
    setPrevRawUrl(rawUrl);
    setHasError(false);
  }

  const showImage = rawUrl && !hasError;

  return (
    <Card
      className={classes.card}
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
    >
      <Card.Section pt="md">
        <Center className={classes.imageCenter}>
          {showImage ? (
            <Image
              src={rawUrl}
              alt={launch.mission_name}
              h={100}
              w="auto"
              fit="contain"
              onError={() => setHasError(true)}
            />
          ) : (
            <Text c="dimmed" size="xs">
              No Image
            </Text>
          )}
        </Center>
      </Card.Section>

      <Stack className={classes.stack} justify="space-between" mt="md">
        <Stack gap={4} align="center">
          <Text fw={700} ta="center" lineClamp={1}>
            {launch.mission_name}
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            {launch.rocket?.rocket_name}
          </Text>
        </Stack>

        <Button fullWidth color="blue" radius="md" onClick={() => onSelect(launch)}>
          See more
        </Button>
      </Stack>
    </Card>
  );
};
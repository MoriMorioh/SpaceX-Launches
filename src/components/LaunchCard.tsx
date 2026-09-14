import { Card, Image, Text, Button, Center, Stack } from '@mantine/core';

interface LaunchCardProps {
  launch: Launch;
  onSelect: (launch: Launch) => void;
}

export const LaunchCard: React.FC<LaunchCardProps> = ({ launch, onSelect }) => {
  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <Card.Section pt="md">
        <Center style={{ height: '120px' }}>
          {launch.links?.mission_patch_small ? (
            <Image
              src={launch.links.mission_patch_small}
              alt={launch.mission_name}
              h={100}
              w="auto"
              fit="contain"
            />
          ) : (
            <Text c="dimmed">No Image</Text>
          )}
        </Center>
      </Card.Section>

      <Stack justify="space-between" mt="md" style={{ flexGrow: 1 }}>
        <Stack gap={4} align="center">
          <Text fw={700} ta="center" lineClamp={1}>
            {launch.mission_name}
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            {launch.rocket?.rocket_name}
          </Text>
        </Stack>

        <Button
          fullWidth
          color="blue"
          radius="md"
          onClick={() => onSelect(launch)}
        >
          See more
        </Button>
      </Stack>
    </Card>
  );
};

import { Group, ThemeIcon, Title } from '@mantine/core';
import { Scan } from 'tabler-icons-react';

const Logo = () => {
  return (
    <Group align="center" position="center" mb="sm">
      <ThemeIcon variant="gradient" size="xl" radius="xl" gradient={{ from: 'teal', to: 'lime', deg: 90 }}>
        <Scan size="20"></Scan>
      </ThemeIcon>
      <Title>QR PASS</Title>
    </Group>
  );
};

export default Logo;

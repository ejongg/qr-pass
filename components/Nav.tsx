import { Burger, Divider, Group, Menu, Title } from '@mantine/core';
import Router from 'next/router';
import { FC, useState } from 'react';
import { useCookies } from 'react-cookie';
import { DoorExit, Home, Scan } from 'tabler-icons-react';

const Nav: FC = () => {
  const [, , removeCookie] = useCookies(['access_token']);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const logout = () => {
    removeCookie('access_token');
    Router.push('/admin/login');
  };

  return (
    <>
      <Group position="apart">
        <Title order={2}>OLRA College Night</Title>
        <Menu
          position="left"
          control={<Burger opened={isNavOpen} color="white" />}
          onOpen={() => setIsNavOpen(true)}
          onClose={() => setIsNavOpen(false)}
        >
          <Menu.Item icon={<Home size={14} />}>Home</Menu.Item>
          <Menu.Item icon={<Scan size={14} />}>QR Scanner</Menu.Item>
          <Divider />
          <Menu.Item onClick={() => logout()} color="red" icon={<DoorExit size={14} />}>
            Logout
          </Menu.Item>
        </Menu>
      </Group>
    </>
  );
};

export default Nav;

import { Burger, Group, Menu, Title } from '@mantine/core';
import Router from 'next/router';
import { FC, useState } from 'react';
import { useCookies } from 'react-cookie';
import Logo from './Logo';

const Nav: FC = () => {
  const [, , removeCookie] = useCookies(['access_token']);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const logout = () => {
    removeCookie('access_token');
    Router.push('/admin/login');
  };

  return (
    <>
      <Group align="center" position="apart">
        <Logo />
        <Menu
          position="left"
          control={<Burger opened={isNavOpen} color="white" />}
          onOpen={() => setIsNavOpen(true)}
          onClose={() => setIsNavOpen(false)}
        >
          <Menu.Item onClick={() => logout()} color="red">
            Logout
          </Menu.Item>
        </Menu>
      </Group>
    </>
  );
};

export default Nav;

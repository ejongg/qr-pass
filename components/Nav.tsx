import { Burger, Group, Menu, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Image from 'next/image';
import Router from 'next/router';
import { FC, useState } from 'react';
import { useCookies } from 'react-cookie';
import logo from '../public/logo.png';

const Nav: FC = () => {
  const isMobile = useMediaQuery('(max-width: 500px)', false);

  const [, , removeCookie] = useCookies(['access_token']);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const logout = () => {
    removeCookie('access_token');
    Router.push('/admin/login');
  };

  return (
    <>
      <Group align="center" position="apart">
        <Group align="center" position="center">
          <Image width={isMobile ? 75 : 100} height={isMobile ? 75 : 100} src={logo} alt="QuickPass" />
        </Group>
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

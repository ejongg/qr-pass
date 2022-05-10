import { Container, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { CookiesProvider } from 'react-cookie';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <CookiesProvider>
      <Head>
        <title>OLRA College Night</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: 'Open Sans, sans-serif',
          colorScheme: 'light',
          headings: {
            fontFamily: 'Open Sans, sans-serif',
          },
        }}
        defaultProps={{
          Button: {
            radius: 'xl',
          },
        }}
      >
        <NotificationsProvider position="top-right">
          <Container py="md">
            <Component {...pageProps} />
          </Container>
        </NotificationsProvider>
      </MantineProvider>
    </CookiesProvider>
  );
}

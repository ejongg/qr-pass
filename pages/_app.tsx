import { Container, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { AppProps } from "next/app";
import Head from "next/head";
import { CookiesProvider } from "react-cookie";
import { Session } from "../context/session";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <CookiesProvider>
      <Head>
        <title>OLRA College Night</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
        }}
      >
        <NotificationsProvider position="top-right">
          <Container py="md">
            <Session>
              <Component {...pageProps} />
            </Session>
          </Container>
        </NotificationsProvider>
      </MantineProvider>
    </CookiesProvider>
  );
}

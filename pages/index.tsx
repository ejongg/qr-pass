import { Alert, Button, Card, Grid, Group, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import type { NextPage } from 'next';
import { useState } from 'react';
import Logo from '../components/Logo';
import QrDisplay from '../components/QrDisplay';

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState<{ name: string; course: string; qrcode: string } | null>(null);

  const form = useForm({
    initialValues: {
      name: '',
    },
  });

  const submit = async (values: typeof form.values) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (res.status !== 201) {
        showNotification({
          title: 'Error',
          message: (await res.json()).message,
          color: 'red',
        });
        return;
      }

      form.reset();
      const body = await res.json();
      setRegistered({ name: body.name, qrcode: body.qrcode, course: body.course });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid>
      <Grid.Col offsetLg={3} lg={6}>
        <Logo />
        <Card>
          {!registered ? (
            <>
              <Title sx={{ textAlign: 'center' }} order={2}>
                OLRA College Night
              </Title>
              <form onSubmit={form.onSubmit(submit)}>
                <Alert title="IMPORTANT" color="blue" my="lg">
                  <Text size="sm" mb="sm">
                    Please input your name in the following format <b>LASTNAME, FIRSTNAME MIDDLENAME</b>.
                  </Text>
                  <Text size="sm" mb="sm">
                    If the system cannot find your name please contact our admin in our facebook group.
                  </Text>
                  <Text size="sm" mb="sm">
                    After registration save the QR Code that will be shown. It will be used for your attendance in the
                    event.
                  </Text>
                </Alert>
                <TextInput required placeholder="Dela Cruz, Juan Garcia" label="Name" {...form.getInputProps('name')} />

                <Group position="right" mt="md">
                  <Button type="submit" loading={isLoading}>
                    Register
                  </Button>
                </Group>
              </form>
            </>
          ) : (
            <QrDisplay props={registered} />
          )}
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default Home;

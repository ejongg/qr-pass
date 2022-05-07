import { Button, Card, Grid, Group, Select, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import type { NextPage } from 'next';
import { useState } from 'react';
import Logo from '../components/Logo';
import QrDisplay from '../components/QrDisplay';

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState<{ name: string; qrcode: string } | null>(null);

  const form = useForm({
    initialValues: {
      name: '',
      course: '',
      year: '',
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
      form.reset();
      const body = await res.json();
      setRegistered({ name: body.name, qrcode: body.qrcode });
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
                <TextInput required label="Name" {...form.getInputProps('name')} />
                <Select
                  required
                  label="Course"
                  data={['BS Entrep', 'BS Early Childhood Education']}
                  {...form.getInputProps('course')}
                />
                <Select required label="Year" data={['1', '2', '3', '4']} {...form.getInputProps('year')} />

                <Group position="right" mt="md">
                  <Button type="submit" loading={isLoading}>
                    Register
                  </Button>
                </Group>
              </form>
            </>
          ) : (
            <QrDisplay name={registered.name} qrcode={registered.qrcode} />
          )}
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default Home;

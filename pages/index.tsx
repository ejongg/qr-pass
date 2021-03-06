import { Alert, Button, Card, Center, Grid, Group, Loader, Select, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { debounce } from 'lodash';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Search } from 'tabler-icons-react';
import { createFileName, useScreenshot } from 'use-react-screenshot';
import { Student } from '../api-interface';
import QrDisplay from '../components/QrDisplay';
import logo from '../public/logo.png';

const Home: NextPage = () => {
  const [, takeScreenShot] = useScreenshot();
  const qrRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [students, setStudents] = useState([]);
  const [registered, setRegistered] = useState<Student | null>(null);
  const [getStarted, setGetStarted] = useState(false);

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
        return;
      }

      form.reset();
      const body: Student = await res.json();
      setRegistered(body);
    } finally {
      setIsLoading(false);
    }
  };

  const search = async (value: string) => {
    if (!value || value.length < 3) {
      return;
    }
    setIsFetching(true);

    const res = await fetch(`/api/students?search=${value}`, {
      method: 'GET',
    });

    if (res.status !== 200) {
      setStudents([]);
      setIsFetching(false);
      return;
    }

    const students = (await res.json()).map((s: any) => s.name);
    setStudents(students);
    setIsFetching(false);
  };

  const download = (image: any) => {
    const a = document.createElement('a');
    a.href = image;
    a.download = createFileName(
      'jpg',
      `olra_college_night_${registered?.name.toLowerCase().replaceAll(',', '').replaceAll(' ', '_')}` ||
        'olra_college_night'
    );
    a.click();
  };

  const downloadScreenshot = () => takeScreenShot(qrRef.current).then(download);

  if (!getStarted) {
    return (
      <Center sx={{ height: '80vh' }}>
        <Group direction="column" align="center" position="center">
          <Image width={150} height={150} src={logo} alt="QuickPass" />
          <Button onClick={() => setGetStarted(true)} size="lg" mt="xl">
            Get started
          </Button>
        </Group>
      </Center>
    );
  }

  return (
    <Grid>
      <Grid.Col offsetLg={3} lg={6}>
        <Group align="center" position="center" mb="xl">
          <Image width={150} height={150} src={logo} alt="QuickPass" />
        </Group>
        <Card>
          {!registered ? (
            <>
              <Title sx={{ textAlign: 'center' }} order={2}>
                OLRA College Night
              </Title>
              <form onSubmit={form.onSubmit(submit)}>
                <Alert title="IMPORTANT" color="blue" my="lg">
                  <Text size="sm">
                    After confirmation, save the QR Code that will be shown. It will be your pass in the event.
                  </Text>
                </Alert>

                <Select
                  searchable
                  clearable
                  placeholder="First Name / Last Name. Atleast 3 letters"
                  data={students}
                  onSearchChange={debounce(search, 1000)}
                  icon={isFetching ? <Loader size="xs" /> : <Search />}
                  {...form.getInputProps('name')}
                />

                <Group position="right" mt="md">
                  <Button color="blue" disabled={!form.values.name} type="submit" loading={isLoading}>
                    Confirm
                  </Button>
                </Group>
              </form>
            </>
          ) : (
            <div ref={qrRef}>
              <QrDisplay student={registered} />
            </div>
          )}
        </Card>
        {registered && (
          <Group direction="column" align="center" mt="lg">
            <Button onClick={() => downloadScreenshot()} color="green">
              Download
            </Button>
            <Button
              onClick={() => {
                setRegistered(null);
                setStudents([]);
              }}
              variant="subtle"
            >
              Back
            </Button>
          </Group>
        )}
      </Grid.Col>
    </Grid>
  );
};

export default Home;

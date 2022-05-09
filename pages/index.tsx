import { Alert, Button, Card, Center, Grid, Group, Select, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { debounce } from 'lodash';
import type { NextPage } from 'next';
import { useRef, useState } from 'react';
import Logo from '../components/Logo';
import QrDisplay from '../components/QrDisplay';
import { useScreenshot, createFileName } from 'use-react-screenshot';
import { Student } from '../api-interface';

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [registered, setRegistered] = useState<Student | null>(null);
  const [, takeScreenShot] = useScreenshot();
  const qrRef = useRef(null);

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
    const res = await fetch(`/api/students?search=${value}`, {
      method: 'GET',
    });

    if (res.status !== 200) {
      console.log(await res.text());
      return [];
    }

    const students = (await res.json()).map((s: any) => s.name);
    setStudents(students);
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
                  <Text size="sm">
                    After confirmation, save the QR Code that will be shown. It will be your pass in the event.
                  </Text>
                </Alert>

                <Select
                  searchable
                  clearable
                  placeholder="Enter your last name. Type atleast 3 letters"
                  data={students}
                  onSearchChange={debounce(search, 1000)}
                  {...form.getInputProps('name')}
                />

                <Group position="right" mt="md">
                  <Button color="green" disabled={!form.values.name} type="submit" loading={isLoading}>
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

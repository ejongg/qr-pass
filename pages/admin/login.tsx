import { Button, Card, Center, Grid, Group, PasswordInput, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { addHours } from 'date-fns';
import { useRouter } from 'next/router';

const AdminLogin = () => {
  const router = useRouter();
  const [_, setCookies] = useCookies(['access_token']);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  });

  const submit = async (data: typeof form.values) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (res.status === 200) {
        showNotification({
          title: 'Success',
          message: 'Login successful',
          color: 'green',
        });
        setCookies('access_token', body.accessToken, {
          expires: addHours(new Date(), 1),
        });
        router.push('/admin/dashboard');
      } else {
        showNotification({
          title: 'Login failed',
          message: body.message,
          color: 'red',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Grid>
        <Grid.Col span={12}>
          <Card>
            <Title sx={{ textAlign: 'center' }} order={2}>
              Admin Login
            </Title>
            <form onSubmit={form.onSubmit(submit)}>
              <TextInput required label="Email" {...form.getInputProps('email')} />
              <PasswordInput required label="Password" {...form.getInputProps('password')} />
              <Group position="right" mt="md">
                <Button type="submit" loading={isLoading}>
                  Login
                </Button>
              </Group>
            </form>
          </Card>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default AdminLogin;

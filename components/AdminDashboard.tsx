import {
  ActionIcon,
  Card,
  Center,
  createStyles,
  Grid,
  Group,
  Loader,
  Paper,
  Switch,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { format, parseISO } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Coin, UserCheck } from 'tabler-icons-react';
import { Student } from '../api-interface';
import { studentContext } from '../context/students';
import QrScanModal from './QrScanModal';

const useStyles = createStyles((theme) => ({
  unregistered: {
    color: theme.colors.gray[5],
  },
  name: {
    width: '50%',
  },
}));

const AdminDashboard = () => {
  const { classes } = useStyles();
  const { students, setStudents } = useContext(studentContext);
  const [{ access_token }] = useCookies(['access_token']);
  const isMobile = useMediaQuery('(max-width: 500px)', false);

  const [filtered, setFiltered] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterPaid, setFilterPaid] = useState(false);
  const [filterRegistered, setFilterRegistered] = useState(false);
  const [filterAttended, setFilterAttended] = useState(false);
  const [searchKey, setSearchKey] = useState<string>('');

  const isPaid = (s: Student) => (filterPaid ? s.paidAt : true);
  const isRegistered = (s: Student) => (filterRegistered ? s.registeredAt : true);
  const didAttend = (s: Student) => (filterAttended ? s.attendedAt : true);
  const isSearched = (s: Student) =>
    s.name.toLowerCase().includes(searchKey.toLowerCase()) || s.course.toLowerCase().includes(searchKey.toLowerCase());

  const search = (value: string) => {
    const isSearched = (s: Student) =>
      s.name.toLowerCase().includes(value.toLowerCase()) || s.course.toLowerCase().includes(value.toLowerCase());

    setFiltered(students.filter((s) => isPaid(s) && isRegistered(s) && isSearched(s) && didAttend(s)));
  };

  const filterPaidStudents = (checked: boolean) => {
    const isPaid = (s: Student) => (checked ? s.paidAt : true);
    setFiltered(students.filter((s) => isPaid(s) && isRegistered(s) && isSearched(s) && didAttend(s)));
  };

  const filterRegisteredStudents = (checked: boolean) => {
    const isRegistered = (s: Student) => (checked ? s.registeredAt : true);
    setFiltered(students.filter((s) => isRegistered(s) && isPaid(s) && isSearched(s) && didAttend(s)));
  };

  const filterAttendedStudents = (checked: boolean) => {
    const didAttend = (s: Student) => (checked ? s.attendedAt : true);
    setFiltered(students.filter((s) => isRegistered(s) && isPaid(s) && isSearched(s) && didAttend(s)));
  };

  const updateStudent = async (student: Student, prop: 'paidAt' | 'attendedAt') => {
    const res = await fetch(`/api/students/${student._id}`, {
      method: 'PUT',
      body: JSON.stringify({ [prop]: student![prop] ? null : new Date() }),
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const body = await res.json();
    setStudents(students.map((s) => (s._id === body._id ? Object.assign(s, body) : s)));
    setFiltered(filtered.map((s) => (s._id === body._id ? Object.assign(s, body) : s)));
  };

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/students', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (res.status === 200) {
        setIsLoading(false);

        const body = await res.json();
        setStudents(body);
        setFiltered(body);
      }
    })();
  }, []);

  const rows = filtered.map((student) => (
    <tr className={!student.registeredAt ? classes.unregistered : ''} key={student._id}>
      <td className={classes.name}>
        <Text weight="bold">{student.name}</Text>
        <Text size="xs">{student.course}</Text>
      </td>
      <td>
        <Group align="center" position="right" spacing="xs">
          <ActionIcon color={student.paidAt ? 'green' : 'gray'} onClick={() => updateStudent(student, 'paidAt')}>
            <Coin />
          </ActionIcon>
          <ActionIcon
            color={student.attendedAt ? 'green' : 'gray'}
            onClick={() => updateStudent(student, 'attendedAt')}
          >
            <UserCheck />
          </ActionIcon>
          {student.registeredAt ? (
            format(parseISO(student.registeredAt), 'MM/dd')
          ) : (
            <Text size="xs" color="gray">
              Not registered
            </Text>
          )}
        </Group>
      </td>
    </tr>
  ));

  const render = () => {
    if (isLoading) {
      return (
        <Center>
          <Loader />
          <Text ml="md">Loading students...</Text>
        </Center>
      );
    }
    if (filtered.length === 0) {
      return (
        <Center>
          <Text>No students found</Text>
        </Center>
      );
    }
    return (
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th style={{ textAlign: 'right' }}>Registration</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
  };

  return (
    <>
      <Grid mt="md">
        <Grid.Col lg={3} span={6}>
          <Paper p="md" shadow="sm">
            <Group position="apart">
              <Text color="blue" size="sm">
                Registered
              </Text>
              <Switch
                checked={filterRegistered}
                disabled={isLoading}
                onChange={(e) => {
                  setFilterRegistered(e.target.checked);
                  filterRegisteredStudents(e.target.checked);
                }}
              />
            </Group>
            <Text color="blue" size="xl" weight="bold">
              {students.filter((s) => s.registeredAt).length} / {students.length}
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col lg={3} span={6}>
          <Paper p="md" shadow="sm">
            <Group position="apart">
              <Text color="green" size="sm">
                Paid
              </Text>
              <Switch
                checked={filterPaid}
                disabled={isLoading}
                onChange={(e) => {
                  setFilterPaid(e.target.checked);
                  filterPaidStudents(e.target.checked);
                }}
              />
            </Group>
            <Text color="green" size="xl" weight="bold">
              {students.filter((s) => s.paidAt).length} / {students.length}
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col lg={3} span={6}>
          <Paper p="md" shadow="sm">
            <Group position="apart" align="center">
              <Text color="yellow" size="sm">
                Attendees
              </Text>
              <Switch
                checked={filterAttended}
                disabled={isLoading}
                onChange={(e) => {
                  setFilterAttended(e.target.checked);
                  filterAttendedStudents(e.target.checked);
                }}
              />
            </Group>
            <Text color="yellow" size="xl" weight="bold">
              {students.filter((s) => s.attendedAt).length} / {students.length}
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>
      <Card mt="md">
        <Group position="apart" mb="lg">
          <TextInput
            radius="xl"
            type="search"
            placeholder="Search"
            size={isMobile ? 'xs' : 'sm'}
            onKeyUp={(e) => {
              setSearchKey(e.currentTarget.value);
              search(e.currentTarget.value);
            }}
          />
          <QrScanModal />
        </Group>
        {render()}
      </Card>
    </>
  );
};

export default AdminDashboard;

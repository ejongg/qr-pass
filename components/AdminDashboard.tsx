import { ActionIcon, Card, Center, createStyles, Group, Loader, Table, Text, TextInput } from '@mantine/core';
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

  const search = (value: string) => {
    const searched = students.filter(
      (s) => s.name.toLowerCase().includes(value.toLowerCase()) || s.course.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(searched);
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

  return (
    <Card mt="md">
      <Group position="apart" mb="lg">
        <TextInput
          radius="xl"
          type="search"
          placeholder="Search"
          size={isMobile ? 'xs' : 'sm'}
          onKeyUp={(e) => search(e.currentTarget.value)}
        />
        <QrScanModal />
      </Group>
      {isLoading ? (
        <Center>
          <Loader />
          <Text ml="md">Loading students...</Text>
        </Center>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ textAlign: 'right' }}>Registration</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      )}
    </Card>
  );
};

export default AdminDashboard;

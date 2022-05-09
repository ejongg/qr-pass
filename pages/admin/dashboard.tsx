import { ActionIcon, Card, createStyles, Group, Table, Text, TextInput } from '@mantine/core';
import { format, parseISO } from 'date-fns';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Coin, UserCheck } from 'tabler-icons-react';
import { Student } from '../../api-interface';
import Nav from '../../components/Nav';
import QrScanModal from '../../components/QrScanModal';

const useStyles = createStyles((theme) => ({
  unregistered: {
    color: theme.colors.gray[5],
  },
  name: {
    width: '50%',
  },
}));

const Dashboard: NextPage<{ initialData: Student[] }> = ({ initialData }) => {
  const { classes } = useStyles();
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [{ access_token }] = useCookies(['access_token']);

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
        authorization: `Bearer ${access_token}`,
      },
    });
    const body = await res.json();
    setStudents(students.map((s) => (s._id === body._id ? Object.assign(s, body) : s)));
    setFiltered(filtered.map((s) => (s._id === body._id ? Object.assign(s, body) : s)));
  };

  useEffect(() => {
    setFiltered(initialData);
    setStudents(initialData);
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
    <>
      <Nav></Nav>
      <Card mt="md">
        <Group position="apart" mb="lg">
          <TextInput radius="xl" placeholder="Search" onKeyUp={(e) => search(e.currentTarget.value)} />
          <QrScanModal />
        </Group>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ textAlign: 'right' }}>Registration</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Card>
    </>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/students', {
    method: 'GET',
  });

  const students: Student[] = await res.json();
  return {
    props: {
      initialData: students,
    },
  };
};

import { ActionIcon, Card, createStyles, Group, Table, Text, TextInput } from '@mantine/core';
import { format, parseISO } from 'date-fns';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
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

const Dashboard: NextPage<{ students: Student[] }> = ({ students }) => {
  const { classes } = useStyles();
  const [filtered, setFiltered] = useState<Student[]>([]);

  const search = (value: string) => {
    const searched = students.filter(
      (s) => s.name.toLowerCase().includes(value.toLowerCase()) || s.course.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(searched);
  };

  useEffect(() => {
    setFiltered(students);
  }, []);

  const rows = filtered.map((student, index) => (
    <tr className={!student.registration ? classes.unregistered : ''} key={index}>
      <td className={classes.name}>
        <Text weight="bold">{student.name}</Text>
        <Text size="xs">{student.course}</Text>
      </td>
      <td>
        {student.registration ? (
          <Group align="center" position="right" spacing="xs">
            <ActionIcon color="gray">
              <Coin />
            </ActionIcon>
            <ActionIcon color="gray">
              <UserCheck />
            </ActionIcon>
            {format(parseISO(student.registration!.createdAt), 'MM/dd')}
          </Group>
        ) : (
          <Text size="xs" align="right" color="gray">
            Not registered
          </Text>
        )}
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
      students,
    },
  };
};

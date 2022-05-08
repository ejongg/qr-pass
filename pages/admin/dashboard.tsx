import { ActionIcon, Card, Group, Table, Text, TextInput } from '@mantine/core';
import { format, parseISO } from 'date-fns';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Coin, UserCheck } from 'tabler-icons-react';
import Nav from '../../components/Nav';
import QrScanModal from '../../components/QrScanModal';

const Dashboard: NextPage<{ registrations: Registration[] }> = ({ registrations }) => {
  const [filtered, setFiltered] = useState<Registration[]>([]);

  const search = (value: string) => {
    const searched = registrations.filter(
      (r) => r.name.toLowerCase().includes(value.toLowerCase()) || r.course.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(searched);
  };

  useEffect(() => {
    setFiltered(registrations);
  }, []);

  const rows = filtered.map((r, index) => (
    <tr key={index}>
      <td>
        <Text weight="bold">{r.name}</Text>
        <Text size="xs">
          {r.course} {r.year}
        </Text>
      </td>
      <td>
        <Group align="center" position="right" spacing="xs">
          <ActionIcon color="gray">
            <Coin />
          </ActionIcon>
          <ActionIcon color="gray">
            <UserCheck />
          </ActionIcon>
          {format(parseISO(r.createdAt), 'MM/dd')}
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

interface Registration {
  _id: string;
  name: string;
  course: string;
  year: string;
  paidAt?: string;
  attendedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/registrations', {
    method: 'GET',
  });
  const registrations: Registration[] = await res.json();
  return {
    props: {
      registrations,
    },
  };
};

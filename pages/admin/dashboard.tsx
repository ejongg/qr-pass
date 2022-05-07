import { ActionIcon, Button, Card, Group, Table, Text, TextInput } from '@mantine/core';
import { format, parseISO } from 'date-fns';
import { GetServerSideProps, NextPage } from 'next';
import { Coin, Scan, UserCheck } from 'tabler-icons-react';
import Nav from '../../components/Nav';
import QrScanModal from '../../components/QrScanModal';

const Dashboard: NextPage<{ registrations: Registration[] }> = ({ registrations }) => {
  const rows = registrations.map((r) => (
    <tr key={r._id}>
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
          <TextInput radius="xl" placeholder="Search" />
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

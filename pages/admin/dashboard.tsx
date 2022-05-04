import { ActionIcon, Card, Group, Table } from '@mantine/core';
import { format, parseISO } from 'date-fns';
import { GetServerSideProps, NextPage } from 'next';
import { Coin, Door } from 'tabler-icons-react';
import Nav from '../../components/Nav';

const Dashboard: NextPage<{ registrations: Registration[] }> = ({ registrations }) => {
  const rows = registrations.map((r) => (
    <tr key={r._id}>
      <td>{r.name}</td>
      <td>
        {r.course} {r.year}
      </td>
      <td>
        <Group spacing="sm">
          {format(parseISO(r.createdAt), 'MM/dd')}
          <Coin color="gray" />
          <Door color="gray" />
        </Group>
      </td>
    </tr>
  ));

  return (
    <>
      <Nav></Nav>
      <Card mt="md">
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Registration</th>
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

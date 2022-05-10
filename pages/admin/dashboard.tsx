import AdminDashboard from '../../components/AdminDashboard';
import Nav from '../../components/Nav';
import { Students } from '../../context/students';

const Dashboard = () => {
  return (
    <>
      <Nav></Nav>
      <Students>
        <AdminDashboard />
      </Students>
    </>
  );
};

export default Dashboard;

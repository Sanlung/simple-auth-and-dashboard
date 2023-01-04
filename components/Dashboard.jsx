import {Button} from "reactstrap";

const Dashboard = ({user}) => (
  <>
    <h1>Dashboard</h1>
    <h4>{user.name}</h4>
    <h4>{user.email}</h4>
    <Button href='/api/auth/logout' tag='a' color='primary' outline>
      Log Out
    </Button>
  </>
);

export default Dashboard;

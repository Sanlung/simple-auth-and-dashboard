import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
  Spinner,
} from "reactstrap";
import Profile from "./Profile";

const Dashboard = ({users, profile, onUpdate, hasUpdateFailed}) => {
  return (
    <Card body className='mx-auto shadow' style={{minWidth: "20rem"}}>
      <CardImg />
      <CardTitle className='text-center fs-1'>Dashboard</CardTitle>
      <CardBody>
        {users.isLoading ? (
          <Spinner color='primary'>Loading...</Spinner>
        ) : (
          <Profile
            profile={profile}
            onUpdate={onUpdate}
            hasUpdateFailed={hasUpdateFailed}
          />
        )}
      </CardBody>
    </Card>
  );
};

export default Dashboard;

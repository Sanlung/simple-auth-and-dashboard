import {Card, CardBody, CardTitle, CardImg, Spinner} from "reactstrap";
import Profile from "./Profile";
import Stats from "./Stats";

const Dashboard = ({users, sessions, onUpdate, hasUpdateFailed}) => (
  <Card body className='mx-auto shadow' style={{minWidth: "20rem"}}>
    <CardImg />
    <CardTitle className='text-center fs-1'>Dashboard</CardTitle>
    <CardBody>
      {users.isLoading ? (
        <Spinner color='primary' className='d-block mx-auto'>
          Loading...
        </Spinner>
      ) : (
        <>
          <Profile
            profile={users.user}
            onUpdate={onUpdate}
            hasUpdateFailed={hasUpdateFailed}
          />
          <Stats users={users.data} sessions={sessions} />
        </>
      )}
    </CardBody>
  </Card>
);

export default Dashboard;

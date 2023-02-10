import {ListGroup, ListGroupItem, CardTitle, Table} from "reactstrap";
import countDailyUsers from "../util/countDailyUsers";

const Stats = ({users, sessions}) => {
  const dailyUserCounts = countDailyUsers(sessions);

  return (
    <>
      {/* Renders Stats and lists of users */}
      <ListGroup>
        <ListGroupItem active>Statistics</ListGroupItem>
        <ListGroupItem action>
          Total number of users:
          <span className='d-inline-block ms-3'>{users.length}</span>
        </ListGroupItem>
        <ListGroupItem action>
          Active-user count today:
          <span className='d-inline-block ms-3'>{dailyUserCounts[0]}</span>
        </ListGroupItem>
        <ListGroupItem action>
          7-day mean user count:
          <span className='d-inline-block ms-3'>
            {(
              dailyUserCounts.reduce((a, b) => a + b) / dailyUserCounts.length
            ).toFixed(1)}
          </span>
        </ListGroupItem>
      </ListGroup>
      <CardTitle className='text-primary fw-bolder ms-1 mt-2'>
        All Users
      </CardTitle>
      <Table responsive hover>
        <thead>
          <tr className='table-primary'>
            <th>Name</th>
            <th>Signed up on</th>
            <th>No. of logins</th>
            <th>Last session</th>
          </tr>
        </thead>
        <tbody>
          {users.map((usr) => (
            <tr key={usr.id}>
              <td>{usr.profile_name}</td>
              <td>{usr.created_at}</td>
              <td>{usr.logins_count}</td>
              <td>{usr.last_session}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Stats;

import {ListGroup, ListGroupItem, CardTitle, Table} from "reactstrap";

const Stats = ({users, sessions}) => {
  const now = new Date();
  const dayAgo = new Date(now - 86400000);
  const dayAgoStr = dayAgo.toJSON();

  // users with active sessions in last 24 hrs
  // let dailyActiveUsers = [];
  // sessions.filter(sess => sess.session > dayAgoStr).forEach(sess => !dailyActiveUsers.includes(sess.auth0_id) && dailyActiveUsers.push(sess));

  return (
    <>
      {/* Renders Stats and lists of users */}
      <ListGroup>
        <ListGroupItem active>Statistics</ListGroupItem>
        <ListGroupItem action>
          Total number of users:&nbsp;{users.length}
        </ListGroupItem>
        <ListGroupItem action>Active-user count today:</ListGroupItem>
        <ListGroupItem action>7-day mean active users:</ListGroupItem>
      </ListGroup>
      <CardTitle className='text-primary fw-bolder ms-1 mt-2'>
        All Users
      </CardTitle>
      <Table responsive hover>
        <thead>
          <tr className='table-primary'>
            <th>Name</th>
            <th>Signed up on</th>
            <th># of logins</th>
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

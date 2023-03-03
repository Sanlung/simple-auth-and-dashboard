import {useState, useEffect, useCallback} from "react";
import {useUser} from "@auth0/nextjs-auth0/client";
import {Spinner} from "reactstrap";
import Layout from "../components/Layout";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import VerifyEmail from "../components/VerifyEmail";

const Home = () => {
  // get auth0 profile of logged-in user
  const {user, error, isLoading} = useUser();
  // create users state using data from custom DB
  const [users, setUsers] = useState({
    data: [], // all users
    user: {}, // logged-in user
    isLoading: true,
  });
  // create state for user sessions in last 7 days
  const [sessions, setSessions] = useState([]);
  // whether user data failed to update
  const [hasUpdateFailed, setHasUpdateFailed] = useState(false);

  const getUsersAndSessionsData = useCallback(async () => {
    if (user) {
      // console.log(user);
      try {
        // fetch past week's user sessions
        const response1 = await fetch("/api/sessions");
        const sessionData = await response1.json();
        // console.log("/api/sessions", sessionData);

        // fetch all user data
        const response2 = await fetch("/api/users");
        const data2 = await response2.json();
        // console.log("/api/users", data2);

        // add last_session prop to user data
        // & convert timestamps to UTC+8(TPE)
        const userData = data2.users.map((usr) => {
          const usrSessions = sessionData.sessions.filter(
            (sess) => sess.auth0_id === usr.auth0_id
          );
          const lastSession =
            usrSessions[0].session_end !== "--"
              ? usrSessions[0].session_end
              : usrSessions[1]
              ? usrSessions[1].session_end
              : "--";
          usr.created_at = new Date(usr.created_at).toLocaleString();

          return {
            ...usr,
            // timestamp for TPE time (UTC+8)
            last_session:
              lastSession === "--"
                ? "--"
                : new Date(lastSession).toLocaleString(),
          };
        });

        // get custom profile of logged-in user
        const [userInfo] = data2.users.filter(
          (usr) => usr.auth0_id === user.sub
        );
        // add session id to logged-in user profile
        userInfo.session_id = sessionData.sessions[0].id;

        // update sessions state
        setSessions(sessionData.sessions);
        // update users state
        setUsers({
          data: userData,
          user: userInfo,
          isLoading: false,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  // get users & sessions data on mount
  useEffect(() => {
    getUsersAndSessionsData();
  }, [getUsersAndSessionsData]);

  // call API to change user profile_name
  const updateUsername = async (name) => {
    try {
      const response = await fetch("/api/users/rename", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_name: name,
        }),
      });
      const data = await response.json();
      // console.log("/api/users/rename", data);

      if (response.status === 200) {
        // refetch user data
        getUsersAndSessionsData();
      } else {
        setHasUpdateFailed(true);
        // fade out message after 6s
        setTimeout(() => setHasUpdateFailed(false), 6000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Conditionally renders loading/error info or Login
  // UI or Dashboard; denies access to Dashboard
  // when email not verified and prompts to verify
  return (
    <Layout>
      {isLoading ? (
        <Spinner color='primary' className='d-block mx-auto'>
          Loading...
        </Spinner>
      ) : error ? (
        <p className='text-center text-danger fs-5'>{error.message}</p>
      ) : user ? (
        user.email_verified ? (
          <Dashboard
            users={users}
            sessions={sessions}
            onUpdate={updateUsername}
            hasUpdateFailed={hasUpdateFailed}
          />
        ) : (
          <VerifyEmail user={user} />
        )
      ) : (
        <Login />
      )}
    </Layout>
  );
};

export default Home;

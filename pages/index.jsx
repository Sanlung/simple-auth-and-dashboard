import {useState, useEffect, useCallback} from "react";
import {useUser} from "@auth0/nextjs-auth0/client";
import {Spinner} from "reactstrap";
import Layout from "../components/Layout";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import VerifyEmail from "../components/VerifyEmail";
// import useSessionPersistentState from "../util/persistState";

const Home = () => {
  // get auth0 profile for logged-in user
  const {user, error, isLoading} = useUser();
  // create users state using data from custom DB
  const [users, setUsers] = useState({
    data: [],
    count: 0,
    isLoading: true,
  });
  // custom-profile state for logged-in user
  const [profile, setProfile] = useState({});
  // whether user data failed to update
  const [hasUpdateFailed, setHasUpdateFailed] = useState(false);

  const getAllUserData = useCallback(async () => {
    if (user) {
      try {
        // fetch all user data
        const response = await fetch("/api/users");
        const data = await response.json();
        console.log("/api/users", data);

        // get & set logged-in user profile
        const [userinfo] = data.users.filter(
          (usr) => usr.auth0_id === user.sub
        );
        setProfile(userinfo);

        // update users state
        setUsers({
          data: data.users,
          count: data.count,
          isLoading: false,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  useEffect(() => {
    getAllUserData();
  }, [getAllUserData]);

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
      console.log("POST api/users/rename", data);

      if (response.status === 200) {
        // refetch user data
        getAllUserData();
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
            profile={profile}
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

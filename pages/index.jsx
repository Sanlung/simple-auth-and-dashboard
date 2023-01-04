import {useUser} from "@auth0/nextjs-auth0/client";
import Layout from "../components/Layout";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import VerifyEmail from "../components/VerifyEmail";

const Home = () => {
  const {user, error, isLoading} = useUser();
  console.log(user);

  return (
    <Layout>
      {isLoading ? (
        <p className='text-center fs-5'>Loading ...</p>
      ) : error ? (
        <p className='text-center text-danger fs-5'>{error.message}</p>
      ) : user ? (
        user.email_verified ? (
          <Dashboard user={user} />
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

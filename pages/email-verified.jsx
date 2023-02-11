import {useState, useEffect} from "react";
import {useRouter} from "next/router";
import Image from "next/image";
import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Button,
} from "reactstrap";
import Layout from "../components/Layout";

// Page refetches user profile when email verified
const EmailVerified = () => {
  // store refetched user profile
  const [user, setUser] = useState({});
  const router = useRouter();

  useEffect(() => {
    // make API call on mount
    fetch("/api/refresh-token")
      .then((res) => res.json())
      .then((user) => {
        console.log("/api/refresh-token", user);
        // redirect if user email is not verified
        if (!user.email_verified) return router.push("/");
        setUser(user);
      })
      .catch((error) => console.log(error));
  }, [router]);

  return (
    <Layout>
      {/* only renders if user email is verified */}
      {user.email_verified && (
        <Card
          body
          className='text-center mx-auto shadow'
          style={{width: "20rem"}}>
          <Image
            src='/images/firework.jpeg'
            alt='action required'
            width='280'
            height='280'
            priority
          />
          <CardBody>
            <CardTitle tag='h2'>Email Verified</CardTitle>
            <CardSubtitle tag='h5'>
              Your account email has been verified. Account registration is
              complete.
            </CardSubtitle>
            <CardText className='fst-italic'>
              Please click the button below to visit the dashboard.
            </CardText>
            <Button href='/' tag='a' color='primary' outline>
              Go to Dashboard
            </Button>
          </CardBody>
        </Card>
      )}
    </Layout>
  );
};

// protect page from unauthenticated access
export const getServerSideProps = withPageAuthRequired();

export default EmailVerified;

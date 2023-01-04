import {useState} from "react";
import Image from "next/image";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Button,
} from "reactstrap";

const VerifyEmail = ({user}) => {
  const [emailResent, setEmailResent] = useState(null);

  const sendVerificationEmail = async (e) => {
    try {
      const response = await fetch(`/api/verificationEmail?sub=${user.sub}`);
      const data = await response.json();
      console.log("/api/verificationEmail", data);
      if (response.status === 201) {
        setEmailResent("yes");
      } else {
        setEmailResent("no");
      }
      setTimeout(() => setEmailResent(null), 6000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card body className='text-center mx-auto shadow' style={{width: "20rem"}}>
      <Image
        src='/images/action-required.jpeg'
        alt='action required'
        width='280'
        height='280'
        priority
      />
      <CardBody>
        <CardTitle tag='h2'>Action Required</CardTitle>
        <CardSubtitle tag='h5' className='mb-2'>
          Please verify your email to complete the registration.
        </CardSubtitle>
        <CardText className='fst-italic'>
          We&apos;ve sent an email to {user.email}. Please click Confirm Email
          in there to complete registration. Click the button below if you do
          not receive the email.
        </CardText>
        <Button
          color='primary'
          outline
          onClick={(e) => sendVerificationEmail()}>
          Get Verification Email
        </Button>
        {emailResent === "yes" && (
          <CardSubtitle tag='h6' className='mt-3 text-primary'>
            We&apos;ve sent another verification email to {user.email}. You may
            close this page upon completing registration.
          </CardSubtitle>
        )}
        {emailResent === "no" && (
          <CardSubtitle tag='h6' className='mt-3 text-danger'>
            Something went wrong. Please try again or contact{" "}
            <a href='#' className='text-decoration-none'>
              Support
            </a>{" "}
            if the problem persists.
          </CardSubtitle>
        )}
      </CardBody>
    </Card>
  );
};

export default VerifyEmail;

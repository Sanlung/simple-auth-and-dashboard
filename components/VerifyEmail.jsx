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
  // "yes" or "no", for displaying messages
  const [isVerifyEmailSent, setIsVerifyEmailSent] = useState(null);

  // function to resend verificaiton email
  const sendVerificationEmail = async () => {
    try {
      // sending user to /api to resend email
      const response = await fetch("/api/verification-email");
      const data = await response.json();
      console.log("/api/verificationEmail", data);

      // display message per API response
      if (response.status === 201) {
        setIsVerifyEmailSent("yes");
      } else {
        setIsVerifyEmailSent("no");
      }
      // fade out message after 6s
      setTimeout(() => setIsVerifyEmailSent(null), 6000);
    } catch (error) {
      console.log(error);
    }
  };

  // Renders card prompt to verify email
  return (
    <Card body className='text-center mx-auto shadow' style={{width: "20rem"}}>
      <Image
        src='/images/action-required.jpeg'
        alt='action required'
        width='280'
        height='280'
        priority
      />
      <CardTitle tag='h2'>Action Required</CardTitle>
      <CardBody>
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
          Resend Verification Email
        </Button>
        {/* conditionally renders messages upon success or failure to resend verification email */}
        {isVerifyEmailSent === "yes" && (
          <CardSubtitle tag='h6' className='mt-3 text-primary'>
            We&apos;ve sent another verification email to {user.email}. You may
            close this page upon completing registration.
          </CardSubtitle>
        )}
        {isVerifyEmailSent === "no" && (
          <CardSubtitle tag='h6' className='mt-3 text-danger'>
            Something went wrong. Please try again or contact{" "}
            <a href='#' className='text-decoration-none text-primary'>
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

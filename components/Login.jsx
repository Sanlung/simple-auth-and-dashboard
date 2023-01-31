import Image from "next/image";
import {Card, CardBody, CardTitle, Button} from "reactstrap";

const Login = () => (
  <>
    <Card body className='text-center mx-auto shadow' style={{width: "20rem"}}>
      <Image
        src='/images/avatar.jpg'
        alt='logo avatar'
        width='100'
        height='100'
        className='mx-auto'
        priority
      />
      <CardBody>
        <CardTitle tag='h2'>Login Page</CardTitle>
        <Button href='/api/auth/login' tag='a' color='primary' outline>
          Login | Sign Up
        </Button>
      </CardBody>
    </Card>
  </>
);

export default Login;

import {useState, useEffect, useRef} from "react";
import {
  ListGroup,
  ListGroupItem,
  CardText,
  ButtonGroup,
  Button,
} from "reactstrap";

const Profile = ({profile, onUpdate, hasUpdateFailed}) => {
  // for input control
  const [name, setName] = useState(profile.profile_name);
  // toggle display of username or input box
  const [isEdit, setIsEdit] = useState(false);
  // "yes" or "no", for displaying messages
  const [isPWEmailSent, setIsPWEmailSent] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  // function to send change-password email
  const sendChangePasswordEmail = async () => {
    try {
      // sending user to /api to send email
      const response = await fetch("/api/change-password");
      const data = await response.json();
      console.log("/api/change-password", data);

      // display message per API response
      if (response.status === 200) {
        setIsPWEmailSent("yes");
      } else {
        setIsPWEmailSent("no");
      }
      // fade out message after 6s
      setTimeout(() => setIsPWEmailSent(null), 6000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name !== profile.profile_name) {
      onUpdate(name);
    }
    setIsEdit(false);
  };

  return (
    <>
      <ListGroup>
        <ListGroupItem active>
          <span>User Profile</span>
          <Button
            color='primary'
            size='sm'
            href='/api/auth/logout'
            tag='a'
            className='position-absolute end-0'>
            Log Out
          </Button>
        </ListGroupItem>
        <ListGroupItem action>
          {isEdit ? (
            <form id='name-form' onSubmit={(e) => handleSubmit(e)}>
              <label htmlFor='name'>Name:</label>{" "}
              <input
                ref={inputRef}
                name='name'
                type='text'
                value={name}
                className='no-style'
                onChange={(e) => setName(e.target.value)}
              />
            </form>
          ) : (
            <span>Name:&nbsp;{name}</span>
          )}
        </ListGroupItem>
        <ListGroupItem action>Email:&nbsp;{profile.email}</ListGroupItem>
      </ListGroup>
      <ButtonGroup className='my-3'>
        <Button
          color='primary'
          outline
          onClick={(e) => sendChangePasswordEmail()}>
          Change Password
        </Button>
        {isEdit ? (
          <Button
            form='name-form'
            color='primary'
            outline
            tag='input'
            type='submit'
            value='Submit Name'
          />
        ) : (
          <Button color='primary' outline onClick={(e) => setIsEdit(true)}>
            Edit Name
          </Button>
        )}
      </ButtonGroup>
      {/* conditionally renders messages upon success or failure to send email or to update user */}
      {isPWEmailSent === "yes" && (
        <CardText tag='h6' className='mt-3 text-primary'>
          We&apos;ve sent an email to {profile.email}. Please follow the
          instructions in the email to change your passowrd.
        </CardText>
      )}
      {(hasUpdateFailed || isPWEmailSent === "no") && (
        <CardText tag='h6' className='mt-3 text-danger'>
          Something went wrong. Please try again or contact{" "}
          <a href='#' className='text-decoration-none text-primary'>
            Support
          </a>{" "}
          if the problem persists.
        </CardText>
      )}
    </>
  );
};

export default Profile;

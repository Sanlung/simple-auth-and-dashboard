import {useState, useEffect, useRef} from "react";
import {useRouter} from "next/router";
import {
  ListGroup,
  ListGroupItem,
  CardText,
  ButtonGroup,
  Button,
} from "reactstrap";

const Profile = ({profile, onUpdate, hasUpdateFailed}) => {
  // get Auth0 identity provider
  const idProvider = profile.auth0_id.split("|")[0].split("-")[0];
  // for displaying prohibitive message
  const [isProhibited, setIsProhibited] = useState(false);
  // for controlled input
  const [name, setName] = useState(profile.profile_name);
  // toggle display of username or input field
  const [isEdit, setIsEdit] = useState(false);
  // "yes" or "no", for displaying messages
  const [isPWEmailSent, setIsPWEmailSent] = useState(null);
  const inputRef = useRef();
  const router = useRouter();

  // focus input filed
  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  // function to send change-password email
  const sendChangePasswordEmail = async () => {
    if (idProvider === "auth0") {
      try {
        // sending user to /api to send email
        const response = await fetch("/api/auth/change-password");
        const data = await response.json();
        // console.log("/api/change-password", data);

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
    } else {
      // display prohibitive message
      setIsProhibited(true);
      // fade out message after 6s
      setTimeout(() => setIsProhibited(false), 6000);
    }
  };

  // function to update user name
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name !== profile.profile_name) {
      onUpdate(name);
    }
    // reset to display name
    setIsEdit(false);
  };

  const handleLogOut = async () => {
    try {
      const response = await fetch("/api/sessions/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: profile.session_id,
        }),
      });
      const data = await response.json();
      // console.log("/api/sessions/end", data);

      if (response.status === 200) {
        router.push("/api/auth/logout");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Renders logged in user name & email
  return (
    <>
      <ListGroup>
        <ListGroupItem active>
          <span>User Info</span>
          <Button
            color='primary'
            size='sm'
            className='position-absolute end-0 me-1'
            onClick={(e) => handleLogOut()}>
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
                className='no-style d-inline-block ms-2'
                onChange={(e) => setName(e.target.value)}
              />
            </form>
          ) : (
            <span>
              Name:<span className='d-inline-block ms-3'>{name}</span>
            </span>
          )}
        </ListGroupItem>
        <ListGroupItem action>
          Email:<span className='d-inline-block ms-3'>{profile.email}</span>
        </ListGroupItem>
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
      {isProhibited && (
        <CardText tag='h6' className='my-3 text-danger'>
          You can&apos;t change your password here. Please change your password
          with {idProvider.slice(0, 1).toUpperCase() + idProvider.slice(1)}.
        </CardText>
      )}
      {isPWEmailSent === "yes" && (
        <CardText tag='h6' className='my-3 text-primary'>
          We&apos;ve sent an email to {profile.email}. Please follow the
          instructions in the email to change your passowrd.
        </CardText>
      )}
      {(hasUpdateFailed || isPWEmailSent === "no") && (
        <CardText tag='h6' className='my-3 text-danger'>
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

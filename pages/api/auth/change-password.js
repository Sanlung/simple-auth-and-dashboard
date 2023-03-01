import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";

// Handler to send change-password email
const changePasswordHandler = async (req, res) => {
  // get environment variables ready
  const clientId = process.env.AUTH0_CLIENT_ID;
  const auth0Url = process.env.AUTH0_ISSUER_BASE_URL;

  try {
    // get user session
    const {user} = await getSession(req, res);

    const response = await fetch(`${auth0Url}/dbconnections/change_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        email: user.email,
        connection: "Username-Password-Authentication",
      }),
    });
    const message = await response.text();
    // console.log("auth0Url/dbconnections/change_password", message);

    res.status(response.status).json({message});
  } catch (error) {
    res.status(error.status || 500).json({msg: error.message});
  }
};

// Protect API route on exporting handler
export default withApiAuthRequired(changePasswordHandler);

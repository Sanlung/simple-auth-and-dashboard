import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";

// Handler to create job to send verification email
const verificationEmailHandler = async (req, res) => {
  // get environment variables ready
  const auth0Url = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;

  try {
    // get user session
    const {user} = await getSession(req, res);
    // split user_id, e.g., "facebook|0123456789"
    const identities = user.sub.split("|");

    // get Auth0 Mgt API access token
    const response1 = await fetch(`${auth0Url}/oauth/token`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: `${auth0Url}/api/v2/`,
        grant_type: "client_credentials",
      }),
    });
    const data1 = await response1.json();
    console.log("auth0Url/oauth/token", data1);

    // if auth0 returns access token
    if (response1.status === 200) {
      const accessToken = data1.access_token;

      // create a job to resend verification email
      const response2 = await fetch(
        `${auth0Url}/api/v2/jobs/verification-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user_id: user.sub,
            client_id: clientId,
            identity: {
              user_id: identities[1],
              provider: identities[0],
            },
          }),
        }
      );
      const data2 = await response2.json();
      console.log("auth0Url/api/v2/jobs/verification-email", data2);

      // respond with status whether email is sent
      res.status(response2.status).json(data2);
    }
  } catch (error) {
    res.status(error.status || 500).json({msg: error.message});
  }
};

// Protect API route on exporting handler
export default withApiAuthRequired(verificationEmailHandler);

import {withApiAuthRequired} from "@auth0/nextjs-auth0";

// Handles creating a job to send verification email
const verificationEmailHandler = async (req, res) => {
  // get Auth0 environment variables ready
  const auth0Url = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;

  // get user_id from query params
  const {sub} = req.query;
  // split user_id, e.g., "facebook|0123456789"
  const identities = sub.split("|");

  try {
    // get Auth0 Mgt API access token
    const resp = await fetch(`${auth0Url}/oauth/token`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: `${auth0Url}/api/v2/`,
        grant_type: "client_credentials",
      }),
    });
    const data1 = await resp.json();
    console.log(`auth0Url/oauth/token`, data1);

    // if toiken obtained
    if (resp.status === 200) {
      // create job to resend verification email
      const accessToken = data1.access_token;
      const response = await fetch(
        `${auth0Url}/api/v2/jobs/verification-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user_id: sub,
            client_id: clientId,
            identity: {
              user_id: identities[1],
              provider: identities[0],
            },
          }),
        }
      );
      const data2 = await response.json();
      console.log("auth0Url/api/v2/", data2);
      // respond with status whether email is sent
      res.status(response.status).json(data2);
    } else {
      // respond if token not issued w/o error
      res.status(resp.status).json(data1);
    }
  } catch (error) {
    res.status(error.status || 500).json({error: error.message});
  }
};

// Protect API route on exporting handler
export default withApiAuthRequired(verificationEmailHandler);

import {withApiAuthRequired} from "@auth0/nextjs-auth0";

const verificationEmailHandler = async (req, res) => {
  const accessToken = process.env.AUTH0_MGT_API_ACCESS_TOKEN;
  const auth0Url = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.CLIENT_ID;
  // get user_id from query params
  const {sub} = req.query;
  // split user_id, e.g., "facebook|0123456789"
  const identities = sub.split("|");

  try {
    const response = await fetch(`${auth0Url}/api/v2/jobs/verification-email`, {
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
    });
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    res.status(error.status || 500).json({error: error.message});
  }
};

export default withApiAuthRequired(verificationEmailHandler);

import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";

// Handler to update current session's session_end value
const updateSessionHandler = async (req, res) => {
  // get environment variable & teimstamp ready
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const auth0Url = process.env.AUTH0_ISSUER_BASE_URL;
  const apiBaseUrl = process.env.API_BASE_URL;
  const timestamp = new Date().toJSON();

  try {
    // get access token for backend API
    const tokenRes = await fetch(`${auth0Url}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: `${apiBaseUrl}/api/v1/`,
        grant_type: "client_credentials",
      }),
    });
    const tokenObj = await tokenRes.json();
    const accessToken = tokenObj.access_token;

    // session id
    const {id} = req.body;

    const response = await fetch(`${apiBaseUrl}/api/v1/sessions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        session_end: timestamp,
      }),
    });
    const data = await response.json();
    // console.log("PATCH apiBaseUrl/api/v1/sessions/:id", data);

    res.status(response.status).json(data);
  } catch (error) {
    res.status(error.status || 500).json({msg: error.msg});
  }
};

export default withApiAuthRequired(updateSessionHandler);

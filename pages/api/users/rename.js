import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";

// Handler to create job to send verification email
const changeUsernameHandler = async (req, res) => {
  // get environment variable ready
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const auth0Url = process.env.AUTH0_ISSUER_BASE_URL;
  const apiBaseUrl = process.env.API_BASE_URL;

  try {
    // get access token and logged-in user profile
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
    const {user} = await getSession(req, res);

    // new profile_name
    const jsonData = req.body;

    const response = await fetch(`${apiBaseUrl}/api/v1/users/${user.sub}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(jsonData),
    });
    const data = await response.json();
    // console.log("PATCH apiBaseUrl/api/v1/users/:id", data);

    res.status(response.status).json(data);
  } catch (error) {
    res.status(error.status || 500).json({msg: error.msg});
  }
};

export default withApiAuthRequired(changeUsernameHandler);

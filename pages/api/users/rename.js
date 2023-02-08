import {
  getSession,
  getAccessToken,
  withApiAuthRequired,
} from "@auth0/nextjs-auth0";

// Handler to create job to send verification email
const changeUsernameHandler = async (req, res) => {
  // get environment variable ready
  const apiBaseUrl = process.env.API_BASE_URL;

  try {
    // get access token and logged-in user profile
    const {accessToken} = await getAccessToken(req, res);
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
    console.log("PATCH apiBaseUrl/api/v1/users/:id", data);

    res.status(response.status).json(data);
  } catch (error) {
    res.status(error.status || 500).json({msg: error.msg});
  }
};

export default withApiAuthRequired(changeUsernameHandler);

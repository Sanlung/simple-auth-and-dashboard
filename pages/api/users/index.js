import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";

// Handler to create job to send verification email
const getUserDataHandler = async (req, res) => {
  // get environment variable ready
  const apiBaseUrl = process.env.API_BASE_URL;

  try {
    // get access token for backend API
    const {accessToken} = await getAccessToken(req, res);

    // GET all users
    const response = await fetch(`${apiBaseUrl}/api/v1/users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log("GET apiBaseUrl/api/v1/users", data);

    res.status(response.status).json(data);
  } catch (error) {
    res.status(error.status || 500).json({error: error.message});
  }
};

export default withApiAuthRequired(getUserDataHandler);

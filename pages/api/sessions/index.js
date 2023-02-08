import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";

// Handler to get last week's sessions data
const getSessionDataHandler = async (req, res) => {
  const apiBaseUrl = process.env.API_BASE_URL;

  try {
    // get access token for backend API
    const {accessToken} = await getAccessToken(req, res);

    // GET week's sessions
    const response = await fetch(`${apiBaseUrl}/api/v1/sessions`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log("GET apiBaseUrl/api/v1/sessions", data);

    res.status(response.status).json(data);
  } catch (error) {
    res.status(error.status || 500).json({msg: error.msg});
  }
};

export default withApiAuthRequired(getSessionDataHandler);

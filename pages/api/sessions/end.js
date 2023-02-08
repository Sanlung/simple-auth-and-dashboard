import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";

// Handler to update current session's session_end value
const updateSessionHandler = async (req, res) => {
  const apiBaseUrl = process.env.API_BASE_URL;
  const now = new Date();
  const timestamp = now.toJSON();

  try {
    // get access token for backend API
    const {accessToken} = await getAccessToken(req, res);
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
    console.log("PATCH apiBaseUrl/api/v1/sessions/:id", data);

    res.status(response.status).json(data);
  } catch (error) {
    res.status(error.status || 500).json({msg: error.msg});
  }
};

export default withApiAuthRequired(updateSessionHandler);

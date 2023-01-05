import {handleProfile, withApiAuthRequired} from "@auth0/nextjs-auth0";

// Handles refetch of user profile, returns session
const refreshTokenHandler = async (req, res) => {
  try {
    await handleProfile(req, res, {
      refetch: true,
      afterRefetch: async (_, __, session) => session,
    });
  } catch (error) {
    res.status(error.status || 500).json({message: error.message});
  }
};

// Protect API route on exporting handler
export default withApiAuthRequired(refreshTokenHandler);

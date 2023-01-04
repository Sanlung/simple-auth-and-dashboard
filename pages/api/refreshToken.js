import {handleProfile, withApiAuthRequired} from "@auth0/nextjs-auth0";

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

export default withApiAuthRequired(refreshTokenHandler);

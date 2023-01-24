import {handleProfile, withApiAuthRequired} from "@auth0/nextjs-auth0";

// Handles account creation & refetch of userProfile
const refetchProfileHandler = async (req, res) => {
  await handleProfile(req, res, {
    refetch: true,
    afterRefetch: async (_, __, session) => session,
  });
};

// Protect API route on exporting handler
export default withApiAuthRequired(refetchProfileHandler);

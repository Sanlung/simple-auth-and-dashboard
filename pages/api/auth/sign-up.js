import {handleLogin} from "@auth0/nextjs-auth0";

const showSignupPageHandler = async (req, res) => {
  await handleLogin(req, res, {
    authorizationParams: {
      screen_hint: "signup",
    },
  });
};

export default showSignupPageHandler;

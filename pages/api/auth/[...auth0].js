/*
 * Generates Auth0 dynamic API routes
 * - /api/auth/login
 * - /api/auth/callback
 * - /api/auth/logout
 * - /api/auth/me
 * Also add audience and scope to external API
 */
import {handleAuth, handleLogin} from "@auth0/nextjs-auth0";

const apiBaseUrl = process.env.API_BASE_URL;

export default handleAuth({
  // add external API to Auth0
  login: handleLogin({
    authorizationParams: {
      audience: `${apiBaseUrl}/api/v1/`,
      scope: "openid profile email offline_access",
    },
  }),
});

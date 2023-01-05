/*
 * Generates Auth0 dynamic API routes
 * - /api/auth/login
 * - /api/auth/callback
 * - /api/auth/logout
 * - /api/auth/me
 */
import {handleAuth} from "@auth0/nextjs-auth0";

export default handleAuth();

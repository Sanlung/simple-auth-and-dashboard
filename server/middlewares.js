require("dotenv").config({path: ".env"});
// modules to handle JWT
const {expressjwt: jwt} = require("express-jwt");
const {expressJwtSecret} = require("jwks-rsa");
// get environment variables
const auth0Url = process.env.AUTH0_ISSUER_BASE_URL;
const apiBaseUrl = process.env.API_BASE_URL;

// authenticate JWT in incoming requests
const authenticateJwt = jwt({
  secret: expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${auth0Url}/.well-known/jwks.json`,
  }),
  audience: `${apiBaseUrl}/api/v1/`,
  issuer: `${auth0Url}/`,
  algorithms: ["RS256"],
});

// catch-all error handler
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || 500,
    msg: err.message || "Something went wrong. Try again later.",
  };
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field. Please choose another value.`;
    customError.statusCode = 400;
  }
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((error) => error.message)
      .join("; ");
    customError.statusCode = 400;
  }
  if (err.name === "CastError") {
    customError.msg = `No user found with id ${err.value}`;
    customError.statusCode = 404;
  }
  return res.status(customError.statusCode).json({msg: customError.msg});
};

// 404 not-found page
const notFoundMiddleware = (req, res) =>
  res.status(404).send("Route does not exist");

module.exports = {
  authenticateJwt,
  errorHandlerMiddleware,
  notFoundMiddleware,
};

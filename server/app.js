require("dotenv").config({path: ".env.local"});
require("express-async-errors");

// Swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

// import express app
const express = require("express");
const app = express();

// import middlewares
const {
  authenticateJwt,
  errorHandlerMiddleware,
  notFoundMiddleware,
} = require("./middlewares");

// import routers
const userRouter = require("./routes/users");
const sessionRouter = require("./routes/sessions");

// express middlewares
app.use(express.json());

// API documentation route
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// user routes
app.use("/api/v1/users", authenticateJwt, userRouter);
app.use("/api/v1/sessions", authenticateJwt, sessionRouter);

// catch-all middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// run app on prod server or localhost 3001
const port = process.env.PORT || 3001;

// connect to DB and start app
app.listen(port, () => console.log(`Server is listening on ${port} ...`));

// import express app
const express = require("express");
const app = express();
// import middlewares
const {
  authenticateJwt,
  errorHandlerMiddleware,
  notFoundMiddleware,
} = require("./middlewares");

// import router
const userRouter = require("./routes");

// middlewares
app.use(express.json());
app.use(authenticateJwt);

// home route
app.get("/", (req, res) => res.send("Hello World!"));

// user routes
app.use("/api/v1/users", userRouter);

// catch-all middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// run app on prod server or localhost 3001
const port = process.env.PORT || 3001;

// connect to DB and start app
app.listen(port, () => console.log(`Server is listening on ${port} ...`));
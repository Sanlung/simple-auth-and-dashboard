require("dotenv").config({path: ".env"});
// import Pool module from node-postgres
const {Pool} = require("pg");

// create client-connections pool
const pool = new Pool({
  user: process.env.PGSQL_USER,
  host: process.env.PGSQL_HOST,
  port: process.env.PGSQL_PORT,
  database: process.env.PGSQL_DATABASE,
  password: process.env.PGSQL_PASSWORD,
});

module.exports = pool;

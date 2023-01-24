const pool = require("./dbClients");
const updateFields = require("./patchHelper");
const {
  getAllUsers,
  getOneUser,
  checkDupEmail,
  addOneUser,
  editUserInfo,
  removeOneUser,
} = require("./queries");

// GET /api/v1/users
const getUsers = async (req, res) => {
  try {
    const result = await pool.query(getAllUsers);
    if (!result.rows.length) {
      res.status(404).json({msg: "No users on record."});
    } else {
      res.status(200).json({users: result.rows, count: result.rowCount});
    }
  } catch (err) {
    console.log(err.code, err.message);
  }
};

// GET /api/v1/users/:id
const getUserById = async (req, res) => {
  const auth0_id = req.params.id;
  try {
    const result = await pool.query(getOneUser, [auth0_id]);
    if (!result.rows.length) {
      res.status(404).json({msg: "User was not found."});
    } else {
      res.status(200).json({user: result.rows[0]});
    }
  } catch (err) {
    console.log(err.code, err.message);
  }
};

// POST /api/v1/users
const createUser = async (req, res) => {
  const {auth0_id, profile_name, email, created_at, logins_count} = req.body;
  try {
    // send back bad request if email already exists
    const check = await pool.query(checkDupEmail, [email]);
    if (check.rows.length) {
      res.status(400).json({msg: "Email already exists."});
    } else {
      const result = await pool.query(addOneUser, [
        auth0_id,
        profile_name,
        email,
        created_at,
        logins_count,
      ]);
      if (!result.rowCount) {
        res.status(500).json({msg: "Something went wrong!"});
      } else {
        res.status(201).json({
          msg: "User was created successfully.",
          user: result.rows[0],
        });
      }
    }
  } catch (err) {
    console.log(err.code, err.message);
  }
};

// PATCH /api/v1/users/:id
const updateUser = async (req, res) => {
  const auth0_id = req.params.id;
  const {set, values} = updateFields(req.body);
  try {
    const result = await pool.query(editUserInfo(set), [auth0_id, ...values]);
    if (!result.rowCount) {
      res.status(404).json({msg: "User was not found."});
    } else {
      res.status(200).json({
        msg: "User was updated successfully.",
        user: result.rows[0],
      });
    }
  } catch (err) {
    console.log(err.code, err.message);
  }
};

// DELETE /api/v1/users/:id
const removeUser = async (req, res) => {
  const auth0_id = req.params.id;
  try {
    const result = await pool.query(removeOneUser, [auth0_id]);
    if (!result.rowCount) {
      res.status(404).json({msg: "User was not found."});
    } else {
      res.status(200).json({
        msg: "User was removed successfully.",
        user: result.rows[0],
      });
    }
  } catch (err) {
    console.log(err.code, err.message);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  removeUser,
};

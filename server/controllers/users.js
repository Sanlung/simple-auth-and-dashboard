const pool = require("../dbClients");
const updateFields = require("../patchHelper");
const CustomApiError = require("../customError");
const {
  getAllUsers,
  getOneUser,
  // checkDupEmail,
  addOneUser,
  editUserInfo,
  removeOneUser,
} = require("../queries/users");

// GET /api/v1/users
const getUsers = async (req, res) => {
  const result = await pool.query(getAllUsers);

  res.status(200).json({users: result.rows, count: result.rowCount});
};

// GET /api/v1/users/:id
const getUserById = async (req, res) => {
  const auth0_id = req.params.id;

  const result = await pool.query(getOneUser, [auth0_id]);

  if (!result.rows.length) throw new CustomApiError(404, "User was not found");

  res.status(200).json({user: result.rows[0]});
};

// POST /api/v1/users
const createUser = async (req, res) => {
  const {auth0_id, profile_name, email, created_at, logins_count} = req.body;

  // send back bad-request if email already exists
  // const check = await pool.query(checkDupEmail, [email]);
  // if (check.rows.length) throw new CustomApiError(400, "Email already exists");

  const result = await pool.query(addOneUser, [
    auth0_id,
    profile_name,
    email,
    created_at,
    logins_count,
  ]);

  if (!result.rowCount) throw new CustomApiError(500, "Something went wrong!");

  res.status(201).json({
    msg: "User was created successfully",
    user: result.rows[0],
  });
};

// PATCH /api/v1/users/:id
const updateUser = async (req, res) => {
  // allow update only for profile_name or logins_count
  const field = Object.keys(req.body);
  if (
    field.length === 1 &&
    (field[0] === "profile_name" || field[0] === "logins_count")
  ) {
    const auth0_id = req.params.id;
    const {set, values} = updateFields(req.body);

    const result = await pool.query(editUserInfo(set), [auth0_id, ...values]);

    if (!result.rowCount) throw new CustomApiError(404, "User was not found.");

    res.status(200).json({
      msg: "User was updated successfully.",
      user: result.rows[0],
    });
  } else {
    throw new CustomApiError(400, "You can't change the field(s)");
  }
};

// DELETE /api/v1/users/:id
const removeUser = async (req, res) => {
  const auth0_id = req.params.id;

  const result = await pool.query(removeOneUser, [auth0_id]);

  if (!result.rowCount) throw new CustomApiError(404, "User was not found.");

  res.status(200).json({
    msg: "User was removed successfully.",
    user: result.rows[0],
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  removeUser,
};

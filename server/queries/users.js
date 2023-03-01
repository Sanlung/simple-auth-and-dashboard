// for use by getUsers controller
const getAllUsers = "SELECT * FROM users ORDER BY id";

// for use by getUserById controller
const getOneUser = "SELECT * FROM users WHERE auth0_id = $1";

// for auxiliary use by createUser controller
// const checkDupEmail = "SELECT s FROM users s WHERE s.email = $1";

// for use by createUser controller
const addOneUser =
  "INSERT INTO users(auth0_id, profile_name, email, created_at, logins_count) VALUES($1, $2, $3, $4, $5) RETURNING *";

// for use by updateUser controller
const editUserInfo = (set) =>
  `UPDATE users SET ${set} WHERE auth0_id = $1 RETURNING *`;

// for use by removeUser controller
const removeOneUser = "DELETE FROM users WHERE auth0_id = $1 RETURNING *";

module.exports = {
  getAllUsers,
  getOneUser,
  // checkDupEmail,
  addOneUser,
  editUserInfo,
  removeOneUser,
};

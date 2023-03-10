const {Router} = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  removeUser,
} = require("../controllers/users");

const router = Router();

router.route("/").get(getUsers).post(createUser);
router.route("/:id").get(getUserById).patch(updateUser).delete(removeUser);

module.exports = router;

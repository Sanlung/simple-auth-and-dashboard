const Router = require("express");
const {
  getSessions,
  createSession,
  updateSession,
} = require("../controllers/sessions");

const router = Router();

router.route("/").get(getSessions).post(createSession);
router.route("/:id").patch(updateSession);

module.exports = router;

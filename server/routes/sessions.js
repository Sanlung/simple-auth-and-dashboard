const Router = require("express");
const {
  getSessions,
  createSession,
  getSessionById,
  updateSession,
  deleteSession,
} = require("../controllers/sessions");

const router = Router();

router.route("/").get(getSessions).post(createSession);
router.route("/:id").get(getSessionById).patch(updateSession).delete(deleteSession);

module.exports = router;

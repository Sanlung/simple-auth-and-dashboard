const now = new Date();
const weekAgo = new Date(now - 604800000);
const weekAgoStr = weekAgo.toJSON();

// for use by getSessions controller
const getWeekSessions =
  "SELECT * FROM sessions WHERE session_end = '--' OR session_end > '" +
  weekAgoStr +
  "' ORDER BY id DESC";

// for use by getSessionById controller
const getOneSession = "SELECT * FROM sessions where id = $1";

// for use by startSession controller
const startSession =
  "INSERT INTO sessions(auth0_id, session_start, session_end) VALUES($1, $2, DEFAULT) RETURNING *";

// for use by endSession controller
const closeSession = (set) =>
  `UPDATE sessions SET ${set} WHERE id = $1 RETURNING *`;

// for use by deleteSession controller
const deleteOneSession = "DELETE FROM sessions WHERE id = $1 RETURNING *";

module.exports = {
  getWeekSessions,
  startSession,
  getOneSession,
  closeSession,
  deleteOneSession,
};

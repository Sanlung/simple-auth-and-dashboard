const pool = require("../dbClients");
const updateFields = require("../patchHelper");
const CustomApiError = require("../customError");
const {
  getWeekSessions,
  startSession,
  closeSession,
} = require("../queries/sessions");

// GET /api/v1/sessions
const getSessions = async (req, res) => {
  const result = await pool.query(getWeekSessions);

  res.status(200).json({sessions: result.rows, count: result.rowCount});
};

// POST /api/v1/sessions
const createSession = async (req, res) => {
  const {auth0_id, session_start} = req.body;

  const result = await pool.query(startSession, [auth0_id, session_start]);

  if (!result.rowCount) throw new CustomApiError(500, "Something went wrong!");

  res.status(201).json({
    msg: "Session was created successfully",
    session: result.rows[0],
  });
};

// PATCH /api/v1/sessions/:id
const updateSession = async (req, res) => {
  // allow update only for session_end
  const field = Object.keys(req.body);
  if (field.length > 1 || field[0] !== "session_end")
    throw new CustomApiError(400, "You can't update this info");

  const {id} = req.params;
  const {set, values} = updateFields(req.body);

  const result = await pool.query(closeSession(set), [id, ...values]);

  if (!result.rowCount) throw new CustomApiError(404, "Session was not found.");

  res.status(200).json({
    msg: "Session was updated successfully.",
    session: result.rows[0],
    reqBody: field,
  });
};

module.exports = {getSessions, createSession, updateSession};

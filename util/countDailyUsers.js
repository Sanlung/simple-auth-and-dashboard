const countDailyUsers = (sessions) => {
  // ms from epoch for 00 hours today in TPE time (UTC+8)
  const todayBegins = new Date().setHours(0, 0, 0, 0);
  // ms from epoch for 00 hours 7 days aago (UTC+8)
  const weekAgo = todayBegins - 518400000;
  let dailySessions = [],
    sessionsAccountedFor = 0,
    dailyUsers = [],
    dailyUserCounts = [];

  // today's sessions
  dailySessions = sessions.filter(
    (sess) => sess.session_end === "--" || sess.session_end > new Date(todayBegins).toJSON()
  );
  sessionsAccountedFor += dailySessions.length;
  // save today's active users' IDs to dailyUsers
  dailySessions.forEach((sess) => {
    if (!dailyUsers.includes(sess.auth0_id)) dailyUsers.push(sess.auth0_id);
  });
  // save today's active user counts to dailyUserCounts
  dailyUserCounts.push(dailyUsers.length);

  // count each day's users going backward
  for (let i = todayBegins; i >= weekAgo; i -= 86400000) {
    if (sessions.length === sessionsAccountedFor) break;
    dailyUsers = [];
    // next previous day's sessions
    dailySessions = sessions.filter(
      (sess) => sess.session_end < new Date(i).toJSON() && sess.session_end >= new Date(i - 86400000).toJSON()
    );
    sessionsAccountedFor += dailySessions.length;
    // save that day's active users' IDs to dailyUsers
    dailySessions.forEach((sess) => {
      if (!dailyUsers.includes(sess.auth0_id)) dailyUsers.push(sess.auth0_id);
    });
    // save today's active user counts to dailyUserCounts
    dailyUserCounts.push(dailyUsers.length);
  }
  return dailyUserCounts;
};

export default countDailyUsers;

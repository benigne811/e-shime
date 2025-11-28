import pool from '../config/database.js';

export const createMoodLog = async (req,res) => {
  const {userid,mood_value, mood_label, journal_note } = req.body;
  console.log(userid ,mood_value, mood_label, journal_note);

  const [result] = await pool.execute(
    'INSERT INTO mood_logs (user_id, mood_value, mood_label, journal_note, created_at) VALUES (?, ?, ?, ?, NOW())',
    [userid, mood_value, mood_label, journal_note || null]
  );


  console.log("mood saved!!!");

  return res.json({message: "moodLog data saved!", results: result });
}; 
export const getMoodLogsByUserId = async (userId, res) => {
  try {
    
    if (!userId) {
      return res.status(400).json({
        error: "userId is required"
      });
    }


    const [rows] = await pool.execute(
      `SELECT id, mood_value, mood_label, journal_note, created_at 
       FROM mood_logs 
       WHERE user_id = ? 
       ORDER BY created_at DESC `,
      [userId]
    );

    if (rows.length === 0) {
      return res.json({
        message: "No mood logs found",
        rows: []
      });
    }

    console.log("mood logs", rows); 
    return res.json({
      message: "Mood logs retrieved successfully",
      rows
    });

  } catch (error) {
    console.error("❌ Database Error (getMoodLogsByUserId):", error);

    return res.status(500).json({
      error: "Internal Server Error retrieving mood logs",
      details: error.message
    });
  }
};


export const getMoodLogById = async (id, userId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM mood_logs WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return rows[0];
};

export const getUserMoodStats = async (userId, days = 30,res) => {
  const [rows] = await pool.execute(
    `SELECT 
      mood_value,
      mood_label,
      COUNT(*) as count,
      DATE(created_at) as log_date
     FROM mood_logs 
     WHERE user_id = ? 
     AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
     GROUP BY mood_value, mood_label, DATE(created_at)
     ORDER BY created_at DESC`,
    [userId, days]
  );
  return res.json({rows:rows});
};

export const getAverageMood = async (userId, days = 7) => {
  const [rows] = await pool.execute(
    `SELECT AVG(mood_value) as average_mood
     FROM mood_logs 
     WHERE user_id = ? 
     AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
    [userId, days]
  );
  return rows[0]?.average_mood || 0;
};

export const getMoodDistribution = async (days = 30) => {
  const [rows] = await pool.execute(
    `SELECT 
      mood_label,
      COUNT(*) as count,
      ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM mood_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY))), 2) as percentage
     FROM mood_logs 
     WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
     GROUP BY mood_label
     ORDER BY mood_value DESC`,
    [days, days]
  );
  return rows;
};

export const deleteMoodLog = async (id, userId) => {
  const [result] = await pool.execute(
    'DELETE FROM mood_logs WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows > 0;
};

const MoodLog = {
  create: createMoodLog,
  getByUserId: getMoodLogsByUserId,
  getById: getMoodLogById,
  getUserStats: getUserMoodStats,
  getAverageMood,
  getMoodDistribution,
  delete: deleteMoodLog
};

export default MoodLog;

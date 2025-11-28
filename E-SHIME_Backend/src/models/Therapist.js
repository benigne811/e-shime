import pool from '../config/database.js';

export const createTherapist = async (therapistData) => {
  const { name, specialization, languages, experience, rating, avatar } = therapistData;

  const [result] = await pool.execute(
    `INSERT INTO therapists (name, specialization, languages, experience, rating, avatar, status, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, 'available', NOW())`,
    [name, specialization, JSON.stringify(languages), experience, rating || 5.0, avatar || '👨🏾‍⚕️']
  );

  return result.insertId;
};

export const getAllTherapists = async () => {
  const [rows] = await pool.execute(
    'SELECT id, name, specialization, languages, experience, rating, avatar, status FROM therapists ORDER BY name'
  );

  return rows.map(row => ({
    ...row,
    languages: JSON.parse(row.languages)
  }));
};

export const getTherapistById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM therapists WHERE id = ?',
    [id]
  );

  if (rows[0]) {
    rows[0].languages = JSON.parse(rows[0].languages);
  }

  return rows[0];
};

export const updateTherapistStatus = async (id, status) => {
  const [result] = await pool.execute(
    'UPDATE therapists SET status = ?, updated_at = NOW() WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

export const updateTherapistRating = async (id, newRating) => {
  const [result] = await pool.execute(
    'UPDATE therapists SET rating = ?, updated_at = NOW() WHERE id = ?',
    [newRating, id]
  );
  return result.affectedRows > 0;
};

export const getTherapistStats = async () => {
  const [total] = await pool.execute(
    'SELECT COUNT(*) as count FROM therapists'
  );

  const [available] = await pool.execute(
    'SELECT COUNT(*) as count FROM therapists WHERE status = "available"'
  );

  return {
    total: total[0].count,
    available: available[0].count
  };
};

export const createBooking = async (userId, bookingData) => {
  const { therapist_id, booking_date, booking_time } = bookingData;

  const [result] = await pool.execute(
    `INSERT INTO bookings (user_id, therapist_id, booking_date, booking_time, status, created_at) 
     VALUES (?, ?, ?, ?, 'pending', NOW())`,
    [userId, therapist_id, booking_date, booking_time]
  );

  return result.insertId;
};

export const getBookingsByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT b.*, t.name as therapist_name, t.avatar as therapist_avatar, t.specialization
     FROM bookings b
     JOIN therapists t ON b.therapist_id = t.id
     WHERE b.user_id = ?
     ORDER BY b.booking_date DESC, b.booking_time DESC`,
    [userId]
  );
  return rows;
};

export const getBookingsByTherapistId = async (therapistId) => {
  const [rows] = await pool.execute(
    `SELECT b.*, u.name as user_name, u.email as user_email
     FROM bookings b
     JOIN users u ON b.user_id = u.id
     WHERE b.therapist_id = ?
     ORDER BY b.booking_date DESC, b.booking_time DESC`,
    [therapistId]
  );
  return rows;
};

export const updateBookingStatus = async (id, status) => {
  const [result] = await pool.execute(
    'UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

export const cancelBooking = async (id, userId) => {
  const [result] = await pool.execute(
    'UPDATE bookings SET status = "cancelled", updated_at = NOW() WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows > 0;
};

export const getBookingStats = async () => {
  const [total] = await pool.execute(
    'SELECT COUNT(*) as count FROM bookings'
  );

  const [completed] = await pool.execute(
    'SELECT COUNT(*) as count FROM bookings WHERE status = "completed"'
  );

  return {
    total: total[0].count,
    completed: completed[0].count
  };
};

export const Therapist = {
  create: createTherapist,
  getAll: getAllTherapists,
  getById: getTherapistById,
  updateStatus: updateTherapistStatus,
  updateRating: updateTherapistRating,
  getStats: getTherapistStats
};

export const Booking = {
  create: createBooking,
  getByUserId: getBookingsByUserId,
  getByTherapistId: getBookingsByTherapistId,
  updateStatus: updateBookingStatus,
  cancel: cancelBooking,
  getStats: getBookingStats
};

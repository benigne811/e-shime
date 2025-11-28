import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const createUser = async (res, username , email, password) => {


  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing data" });
  }

    const [existing] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (existing && existing.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
      console.log("Email already in use");
    }

    const hashpass = await bcrypt.hash(password, 10);

    await pool.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      username,
      email,
      hashpass,
    ]);

  console.log("Sign Up successfully")
  return res.status(201).json({ message: "Sign Up successfully" });

};
export const findUserByEmail = async email => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [
    email,
  ]);
  return rows[0];
};

export const findUserById = async id => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

export const updateUser = async (id, userData) => {
  const fields = [];
  const values = [];

  if (userData.name) {
    fields.push('name = ?');
    values.push(userData.name);
  }
  if (userData.email) {
    fields.push('email = ?');
    values.push(userData.email);
  }
  if (userData.password) {
    fields.push('password = ?');
    values.push(await bcrypt.hash(userData.password, 10));
  }

  if (fields.length === 0) return false;

  fields.push('updated_at = NOW()');
  values.push(id);

  const [result] = await pool.execute(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  return result.affectedRows > 0;
};

export const deleteUser = async id => {
  const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

export const getAllUsers = async (limit = 50, offset = 0) => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
  return rows;
};

export const getUserStats = async () => {
  const [totalUsers] = await pool.execute(
    'SELECT COUNT(*) as count FROM users WHERE role = "user"'
  );

  const [activeUsers] = await pool.execute(
    'SELECT COUNT(DISTINCT user_id) as count FROM mood_logs WHERE DATE(created_at) >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
  );

  return {
    totalUsers: totalUsers[0].count,
    activeUsers: activeUsers[0].count,
  };
};

export const verifyUser = async (res,email, password) => {
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const [results] = await pool.execute('SELECT * FROM users WHERE email = ?', [
    email,
  ]);

  if (!results || results.length === 0) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const user = results[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET missing in .env');
    return res.status(500).json({ error: 'Internal server error' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );

  console.log(user.name, ': logged in!!!');

  return res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      online: user.online,
      email: user.email,
    },
  });
};

const User = {
  create: createUser,
  findByEmail: findUserByEmail,
  findById: findUserById,
  update: updateUser,
  delete: deleteUser,
  getAll: getAllUsers,
  getStats: getUserStats,
  verifyuser: verifyUser,
};

export default User;

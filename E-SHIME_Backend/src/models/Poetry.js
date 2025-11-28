import pool from '../config/database.js';

export const createPoetryStory = async (req, res) => {
  try {
    const { title, content } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO poetryStories 
        (title, content) 
       VALUES (?, ?)`,
      [title, content]
    );

    return res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Error creating poetry story:', err);
    return res.status(500).json({ error: 'Failed to create poetry story' });
  }
};

export const getAllPoetryStories = async (req, res) => {
  try {
 

    const [rows] = await pool.execute(
      `SELECT title, content, created_at
       FROM poetryStories 
       ORDER BY created_at DESC`,

    );

    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching poetry stories:', err);
    return res.status(500).json({ error: 'Failed to fetch poetry stories' });
  }
};


const poetryStory = {
  create: createPoetryStory,
  getAll: getAllPoetryStories,
};

export default poetryStory;

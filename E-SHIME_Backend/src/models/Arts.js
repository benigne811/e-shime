import pool from '../config/database.js';


export const createArtStory = async (req, res) => {
  try {
    const { title, content, media_url } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO artStories 
        (title, content, link ) 
       VALUES (?, ?, ?)`,
      [title, content, media_url || null]
    );

    return res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Error creating art story:', err);
    return res.status(500).json({ error: 'Failed to create art story' });
  }
};

export const getAllArtStories = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id,title, content, link, created_at
       FROM artStories 
       ORDER BY created_at DESC`
    );

    console.log(rows);
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching art stories:', err);
    return res.status(500).json({ error: 'Failed to fetch art stories' });
  }
};


const artStory = {
  create: createArtStory,
  getAll: getAllArtStories,
};

export default artStory;

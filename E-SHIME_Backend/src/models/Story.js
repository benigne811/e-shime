import pool from '../config/database.js';

export const createStory = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const [result] = await pool.execute(
      `INSERT INTO stories (title, content) VALUES (?, ?)`,
      [title, content]
    );

    res.status(201).json({
      message: "Story created successfully",
      storyId: result.insertId,
    });

  } catch (error) {
    console.error("Error inserting story:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllStories = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, title, content, created_at 
       FROM stories
       ORDER BY created_at DESC`
    );

    res.status(200).json(rows);

  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const Story = {
  create: createStory,
  getAll: getAllStories,

};

export default Story;

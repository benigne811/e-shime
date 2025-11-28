import pool from '../config/database.js';

export const createMessage = async messageData => {
  try {
    if (!messageData) {
      throw new Error('No message data provided.');
    }

    const { id, text, sender } = messageData;

    if (!id) throw new Error('sender_id is required.');
    if (!text) throw new Error('message_text is required.');
    if (!sender) throw new Error('sender_type is required.');

    if (typeof text !== 'string') {
      throw new Error('message_text must be a string.');
    }

    const [result] = await pool.execute(
      `INSERT INTO messages (sender_id, receiver_id, room_type, message_text, sender_type, created_at) 
       VALUES (?,?,?,?,?, NOW())`,
      [id, null, null, text, sender]
    );

    console.log('Message inserted into DB with ID:', result.insertId);

    return {
      success: true,
      message_id: result.insertId,
      message: 'Message saved successfully.',
    };
  } catch (err) {
    console.error('🔥 Error inserting message:', err.message);

    return {
      success: false,
      error: err.message || 'Unknown error occurred while saving message.',
    };
  }
};

export const createTherapistMessage = async messageData => {
  try {
    if (!messageData) {
      throw new Error('No message data provided.');
    }

    const { id, text, room, sender } = messageData;

    console.log(messageData);


    if (!id) throw new Error('sender_id is required.');
    if (!text) throw new Error('message_text is required.');
    if (!sender) throw new Error('sender_type is required.');
    if (!room) throw new Error('room is required.');
    if (typeof text !== 'string') {
      throw new Error('message_text must be a string.');
    }

    const [result] = await pool.execute(
      `INSERT INTO therapistMessages (sender_id, receiver_id, room_type, message_text, sender_type, created_at) 
       VALUES (?,?,?,?,?, NOW())`,
      [id, null, room, text, sender]
    );

    console.log('Message inserted into DB with ID:', result.insertId);

    return {
      success: true,
      message_id: result.insertId,
      message: 'Message saved successfully.',
    };
  } catch (err) {
    console.error('🔥 Error inserting message:', err.message);
    return {
      success: false,
      error: err.message || 'Unknown error occurred while saving message.',
    };
  }
};
export const getMessages = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT sender_id, message_text, sender_type, created_at
       FROM messages
       ORDER BY created_at ASC`
    );

    console.log(rows.reverse());

    return res.json({
      success: true,
      messages: rows.reverse(),
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
};

export const getTherapistMessages = async (userId, req, res) => {
  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId query parameter is required',
      });
    }

    const [rows] = await pool.execute(
      `SELECT sender_id, room_type, message_text, sender_type, created_at
       FROM therapistMessages
       WHERE room_type = ?
       ORDER BY created_at ASC`,
      [`therapist-${userId}`] 
    );

    console.log(rows.reverse());

    return res.json({
      success: true,
      messages: rows.reverse(),
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
};
export const getPrivateMessages = async (userId1, userId2, limit = 50) => {
  const [rows] = await pool.execute(
    `SELECT m.*, u.name as sender_name
     FROM messages m
     LEFT JOIN users u ON m.sender_id = u.id
     WHERE ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?))
     AND m.room_type = 'private'
     ORDER BY m.created_at DESC
     LIMIT ?`,
    [userId1, userId2, userId2, userId1, limit]
  );
  return rows.reverse();
};

export const getRecentRooms = async userId => {
  const [rows] = await pool.execute(
    `SELECT DISTINCT 
      CASE 
        WHEN sender_id = ? THEN receiver_id 
        ELSE sender_id 
      END as other_user_id,
      room_type,
      MAX(created_at) as last_message_time
     FROM messages
     WHERE (sender_id = ? OR receiver_id = ?) AND room_type = 'therapist'
     GROUP BY other_user_id, room_type
     ORDER BY last_message_time DESC`,
    [userId, userId, userId]
  );
  return rows;
};
export const deleteOldMessages = async (days = 90) => {
  const [result] = await pool.execute(
    'DELETE FROM messages WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
    [days]
  );
  return result.affectedRows;
};

export const getMessageStats = async () => {
  const [total] = await pool.execute('SELECT COUNT(*) as count FROM messages');

  const [therapistMessages] = await pool.execute(
    'SELECT COUNT(*) as count FROM messages WHERE room_type = "therapist"'
  );

  const [peerMessages] = await pool.execute(
    'SELECT COUNT(*) as count FROM messages WHERE room_type = "peer"'
  );

  return {
    total: total[0].count,
    therapist: therapistMessages[0].count,
    peer: peerMessages[0].count,
  };
};

const Message = {
  create: createMessage,
  createTherapist: createTherapistMessage,
  getMessage: getMessages,
  getTherapyMessage: getTherapistMessages,
  getPrivateMessages,
  getRecentRooms,
  deleteOld: deleteOldMessages,
  getStats: getMessageStats,
};

export default Message;

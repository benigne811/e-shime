import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { testConnection } from './config/database.js';
import { getAICounselorResponse } from './services/aiService.js';
import Message from './models/Message.js';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth.js';
import moodRoutes from './routes/mood.js';
import storyRoutes from './routes/stories.js';
import therapistRoutes from './routes/therapists.js';
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import messageRoute from './routes/peer-messages.js';
import therapistMessageRoute from './routes/therapist-message.js';
import artRoute from './routes/artRoute.js';
import poetryRoute from './routes/poetryRoute.js'
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin:"*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'E-SHIME Backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/story', storyRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/getMessages', messageRoute);
app.use('/api/getTherapistMessages', therapistMessageRoute);
app.use('/api/art', artRoute);
app.use('/api/poetry', poetryRoute);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    );
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', socket => {
  const userId = socket.user.id;
console.log(`user ${userId} connected to the sockets`);
  const therapistRoom = `therapist-${userId}`;
  socket.join(therapistRoom);
  console.log(`User ${userId} joined AI therapist room ${therapistRoom}`);

  socket.on('send-therapist-message', async (newMessage) => {
    const userMsg = {
      id: newMessage.id,
      text: newMessage.text,
      sender: "user",
      room: newMessage.room,
    };


    await Message.createTherapist(userMsg);

    try {
      const aiResponseText = await getAICounselorResponse(newMessage.text);
      const aiMessage = {
        id: 1,
        text: aiResponseText,
        room: `therapist-${userId}`,
        sender: "therapist",
      };

      await Message.createTherapist(aiMessage);
      io.to(therapistRoom).emit('receive-therapist-messages', aiMessage);
    } catch (err) {
      console.error('AI Error:', err);
      io.to(therapistRoom).emit('receive-therapist-messages', {
        id: Date.now(),
        text: "I'm here to support you. I'm having trouble processing your message right now. If you're in crisis, please reach out to emergency services.",
        sender: "therapist",
      });
    }
  });

  socket.on('send-peer-message', async (newMessage) => {
    const msg = { id: newMessage.id, text: newMessage.text };
    socket.broadcast.emit('receive-peer-messages', msg);
    await Message.create(newMessage);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${userId}`);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const startServer = async () => {
  try {
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error(
        'Failed to connect to database. Please check your configuration.'
      );
      process.exit(1);
    }
    httpServer.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   E-SHIME Backend Server Running       ║
║   Port: ${PORT}                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}             ║
║   Socket.IO: Enabled                   ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, io };

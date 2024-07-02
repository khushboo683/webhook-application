import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connectDB } from './config/db.js';
import webhookRoutes from './routes/webhookRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { initKafka } from './config/kafka.js';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
dotenv.config();
const app=express()
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
// WebSocket connection handler
io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3001',  // Allow requests from this origin
  }));
  
//routes  
app.use('/api/webhooks', webhookRoutes);
app.use('/api/auth', authRoutes);
const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    initKafka();
  });
  
export { io };
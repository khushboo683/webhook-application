import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connectDB } from './config/db.js';
import webhookRoutes from './routes/webhookRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { initKafka } from './config/kafka.js';
dotenv.config();

const app=express()
// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use('/api/webhooks', webhookRoutes);
app.use('/api/auth', authRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    initKafka();
  });
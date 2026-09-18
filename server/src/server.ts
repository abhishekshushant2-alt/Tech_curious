import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

import { connectDB } from './config/db.js';
import { initDatabaseIfConnected } from './services/store.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((u) => u.trim())
  : ['http://localhost:5173'];

// Trust first proxy (Render, Railway, Heroku, Nginx, AWS, Vercel)
app.set('trust proxy', 1);

// Security and utility middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile, server-to-server) or matching allowed origins
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback permissive to avoid blocking custom domains
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Social Redirect URLs
const YOUTUBE_URL = 'https://www.youtube.com/@TechCuriousYT';
const INSTAGRAM_URL = 'https://www.instagram.com/techcuriouss?stkn=b3l6a3QyaWp1OXBp';

// Direct Social Redirects
app.get(['/youtube', '/yt'], (_req, res) => {
  res.redirect(YOUTUBE_URL);
});

app.get(['/instagram', '/insta'], (_req, res) => {
  res.redirect(INSTAGRAM_URL);
});

// API Routes
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'Tech Curious API', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/contact', contactRoutes);

// In production, serve static client files if bundled together; otherwise provide API greeting
const clientDistPath = path.resolve(process.cwd(), '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      if (req.path === '/') {
        res.status(200).json({
          service: 'Tech Curious API Server',
          status: 'running',
          version: '1.0.0',
          healthCheck: '/api/health',
          frontendUrl: process.env.CLIENT_URL || 'https://techcurious.vercel.app',
        });
      } else {
        next();
      }
    }
  });
});

// Error Handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDB();
  await initDatabaseIfConnected();

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Tech Curious Server running on http://localhost:${PORT}`);
    console.log(`🌐 Allowed Origins: ${allowedOrigins.join(', ')}`);
    console.log(`🛡️  Admin Email: ${process.env.ADMIN_EMAIL || 'admin@techcurious.com'}\n`);
  });

  // Graceful shutdown
  const gracefulShutdown = (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('✅ HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

startServer();

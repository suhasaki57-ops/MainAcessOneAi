import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import corsOptions from './config/cors.js';
import apiRouter from './routes/index.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import aiRoutes from './routes/ai.routes.js';
import documentRoutes from './routes/document.routes.js';
import accessibilityRoutes from './routes/accessibility.routes.js';
import errorHandler from './middleware/error.middleware.js';
import { ApiResponse } from './utils/apiResponse.js';

const app = express();

// Security and middleware configurations
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json(new ApiResponse(200, { status: 'healthy', timestamp: new Date() }, 'Backend API Operational'));
});

// Dual API Route Mounts for maximum client compatibility
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/accessibility', accessibilityRoutes);
app.use('/api/v1', apiRouter);

// Global Error Handler
app.use(errorHandler);

export default app;

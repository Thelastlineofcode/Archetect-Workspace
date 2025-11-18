/**
 * Archetect Backend API
 * Main entry point for the application
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { rateLimiter } from './middleware/rateLimiter';

// Import routes (to be created)
// import authRoutes from './routes/auth';
// import profileRoutes from './routes/profiles';
// import compatibilityRoutes from './routes/compatibility';

const app = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use(rateLimiter);

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: '0.1.0',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// ROUTES
// ============================================================================

// API v1 routes
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/profiles', profileRoutes);
// app.use('/api/v1/compatibility', compatibilityRoutes);

// Placeholder route
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Archetect API v1',
    documentation: '/api/v1/docs',
    endpoints: {
      auth: '/api/v1/auth',
      profiles: '/api/v1/profiles',
      compatibility: '/api/v1/compatibility',
      communicationTips: '/api/v1/communication-tips',
      meetingPrep: '/api/v1/meeting-prep',
      enrichment: '/api/v1/enrichment',
      crm: '/api/v1/crm',
    },
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// Global error handler
app.use(errorHandler);

// ============================================================================
// SERVER STARTUP
// ============================================================================

const server = app.listen(config.port, () => {
  logger.info(`🚀 Archetect API server started`);
  logger.info(`📡 Environment: ${config.nodeEnv}`);
  logger.info(`🌐 Port: ${config.port}`);
  logger.info(`🔗 URL: http://localhost:${config.port}`);
  logger.info(`📊 Health check: http://localhost:${config.port}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;

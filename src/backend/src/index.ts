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

// Import routes
import routes from './routes';

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
app.use('/api/v1', routes);

// API root
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Archetect API v1',
    version: '0.1.0',
    documentation: '/api/v1/docs',
    endpoints: {
      auth: {
        signup: 'POST /api/v1/auth/signup',
        login: 'POST /api/v1/auth/login',
        refresh: 'POST /api/v1/auth/refresh',
        logout: 'POST /api/v1/auth/logout',
        me: 'GET /api/v1/auth/me',
      },
      profiles: {
        questionnaire: 'GET /api/v1/profiles/questionnaire',
        create: 'POST /api/v1/profiles',
        getMe: 'GET /api/v1/profiles/me',
        getById: 'GET /api/v1/profiles/:id',
        update: 'PUT /api/v1/profiles/:id',
        delete: 'DELETE /api/v1/profiles/:id',
      },
      compatibility: {
        pair: 'POST /api/v1/compatibility/pair',
        team: 'POST /api/v1/compatibility/team',
      },
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

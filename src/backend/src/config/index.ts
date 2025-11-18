/**
 * Application Configuration
 * Centralized configuration management
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Config {
  // Server
  nodeEnv: string;
  port: number;
  corsOrigin: string | string[];

  // Database
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    ssl: boolean;
    poolMin: number;
    poolMax: number;
  };

  // Redis
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };

  // JWT
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };

  // Rate Limiting
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };

  // External Services
  services: {
    astrology: {
      pythonPath: string;
      enginePath: string;
    };
  };

  // Features
  features: {
    enableAstrologyApproach: boolean;
    enableBigFiveApproach: boolean;
    enableCRMIntegrations: boolean;
  };

  // Logging
  logging: {
    level: string;
    format: 'json' | 'simple';
  };
}

export const config: Config = {
  // Server Configuration
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000', 'http://localhost:3001'],

  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'archetect',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: process.env.DB_SSL === 'true',
    poolMin: parseInt(process.env.DB_POOL_MIN || '2', 10),
    poolMax: parseInt(process.env.DB_POOL_MAX || '10', 10),
  },

  // Redis Configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'archetect-dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || 'archetect-dev-refresh-secret-change-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10), // 1 minute
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // External Services
  services: {
    astrology: {
      pythonPath: process.env.PYTHON_PATH || 'python3',
      enginePath: process.env.ASTROLOGY_ENGINE_PATH || '../astrology_engine/src',
    },
  },

  // Feature Flags
  features: {
    enableAstrologyApproach: process.env.ENABLE_ASTROLOGY_APPROACH !== 'false',
    enableBigFiveApproach: process.env.ENABLE_BIG_FIVE_APPROACH !== 'false',
    enableCRMIntegrations: process.env.ENABLE_CRM_INTEGRATIONS !== 'false',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: (process.env.LOG_FORMAT as 'json' | 'simple') || 'simple',
  },
};

// Validation
function validateConfig(): void {
  const requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];

  if (config.nodeEnv === 'production') {
    requiredEnvVars.push('DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD');
  }

  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0 && config.nodeEnv === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Run validation on import
validateConfig();

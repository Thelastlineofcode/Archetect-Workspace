import dotenv from 'dotenv';
dotenv.config();

import db from '../src/db/connection';
import { userRepository, profileRepository } from '../src/db/repositories';
import bcrypt from 'bcrypt';
import logger from '../src/utils/logger';

async function seed() {
  try {
    logger.info('🌱 Starting database seed...');

    // Check if we're in production
    if (process.env.NODE_ENV === 'production') {
      logger.warn('⚠️  Seeding is disabled in production');
      process.exit(0);
    }

    // Create test users
    logger.info('Creating test users...');

    const passwordHash = await bcrypt.hash('password123', 10);

    const user1 = await userRepository.create({
      email: 'john@example.com',
      passwordHash,
      fullName: 'John Doe',
      subscriptionTier: 'free',
    });

    const user2 = await userRepository.create({
      email: 'jane@example.com',
      passwordHash,
      fullName: 'Jane Smith',
      subscriptionTier: 'team',
    });

    const user3 = await userRepository.create({
      email: 'alex@example.com',
      passwordHash,
      fullName: 'Alex Johnson',
      subscriptionTier: 'enterprise',
    });

    logger.info(`✅ Created ${3} test users`);

    // Create test profiles
    logger.info('Creating test profiles...');

    await profileRepository.create({
      userId: user1.id,
      approach: 'astrology',
      discType: 'D',
      archetectType: 'Architect',
      energyStyle: 'Focused',
      flowMode: 'Deep Work',
      season: 'Spring',
      birthData: {
        date: '1990-01-15',
        time: '14:30:00',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York',
      },
      siderealData: {
        sunSign: 'Capricorn',
        moonSign: 'Taurus',
        ascendant: 'Gemini',
        mercury: 'Capricorn',
        nakshatra: 'Uttara Ashadha',
      },
      strengths: ['Strategic thinking', 'Problem solving', 'Leadership'],
      challenges: ['Can be overly critical', 'Impatient with details'],
      workStyle: 'Prefers autonomy and clear goals',
      communicationStyle: 'Direct and results-oriented',
      confidenceScore: 0.85,
    });

    await profileRepository.create({
      userId: user2.id,
      approach: 'big_five',
      discType: 'I',
      archetectType: 'Maverick',
      energyStyle: 'Energetic',
      flowMode: 'Collaboration',
      season: 'Summer',
      bigFiveTraits: [
        { trait: 'openness', score: 0.8 },
        { trait: 'conscientiousness', score: 0.6 },
        { trait: 'extraversion', score: 0.9 },
        { trait: 'agreeableness', score: 0.7 },
        { trait: 'neuroticism', score: 0.3 },
      ],
      strengths: ['Creative thinking', 'Team building', 'Adaptability'],
      challenges: ['Can be scattered', 'Avoids conflict'],
      workStyle: 'Thrives in collaborative environments',
      communicationStyle: 'Enthusiastic and relationship-focused',
      confidenceScore: 0.78,
    });

    await profileRepository.create({
      userId: user3.id,
      approach: 'astrology',
      discType: 'S',
      archetectType: 'Sage',
      energyStyle: 'Balanced',
      flowMode: 'Structured',
      season: 'Autumn',
      birthData: {
        date: '1985-09-22',
        time: '08:15:00',
        latitude: 34.0522,
        longitude: -118.2437,
        timezone: 'America/Los_Angeles',
      },
      siderealData: {
        sunSign: 'Virgo',
        moonSign: 'Cancer',
        ascendant: 'Libra',
        mercury: 'Virgo',
        nakshatra: 'Hasta',
      },
      strengths: ['Analytical skills', 'Attention to detail', 'Reliability'],
      challenges: ['Perfectionism', 'Difficulty delegating'],
      workStyle: 'Methodical and process-oriented',
      communicationStyle: 'Thoughtful and precise',
      confidenceScore: 0.82,
    });

    logger.info(`✅ Created ${3} test profiles`);

    logger.info('🎉 Seed completed successfully!');
    logger.info('\nTest credentials:');
    logger.info('  Email: john@example.com, jane@example.com, alex@example.com');
    logger.info('  Password: password123');

  } catch (error) {
    logger.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

seed();

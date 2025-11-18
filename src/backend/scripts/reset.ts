import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'archetect',
  user: process.env.DB_USER || 'archetect',
  password: process.env.DB_PASSWORD || 'archetect',
});

async function resetDatabase() {
  const client = await pool.connect();

  try {
    // Check if we're in production
    if (process.env.NODE_ENV === 'production') {
      console.error('⛔ Database reset is disabled in production!');
      process.exit(1);
    }

    console.log('⚠️  WARNING: This will delete all data in the database!');
    console.log('🗑️  Dropping all tables...');

    await client.query('BEGIN');

    // Drop tables in reverse order (respecting foreign keys)
    const tables = [
      'audit_log',
      'api_keys',
      'refresh_tokens',
      'crm_contacts',
      'crm_integrations',
      'team_compatibility',
      'team_members',
      'teams',
      'profiles',
      'users',
      'migrations',
    ];

    for (const table of tables) {
      await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
      console.log(`  ✅ Dropped table: ${table}`);
    }

    // Drop custom types
    const types = [
      'subscription_tier',
      'oauth_provider',
      'profile_approach',
      'crm_type',
    ];

    for (const type of types) {
      await client.query(`DROP TYPE IF EXISTS ${type} CASCADE`);
      console.log(`  ✅ Dropped type: ${type}`);
    }

    await client.query('COMMIT');

    console.log('🎉 Database reset completed!');
    console.log('\nNext steps:');
    console.log('  1. Run: npm run migrate');
    console.log('  2. Run: npm run seed (optional)');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Reset failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

resetDatabase();

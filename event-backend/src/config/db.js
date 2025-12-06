require('dotenv').config();
const { Pool } = require('pg');

/**
 * PostgreSQL Database Connection Pool
 * Creates a connection pool for efficient database operations
 */

// Validate environment variables
const requiredEnvVars = ['DB_USER', 'DB_PASS', 'DB_NAME', 'DB_HOST'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('💡 Please create a .env file with the following variables:');
  console.error('   DB_HOST=localhost');
  console.error('   DB_PORT=5432');
  console.error('   DB_NAME=event_db');
  console.error('   DB_USER=postgres');
  console.error('   DB_PASS=your_password');
  console.error('   JWT_SECRET=your_secret_key');
  console.error('   PORT=5000');
}

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
});

/**
 * Test database connection on startup
 */
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  console.error('Error code:', err.code);
  console.error('Error message:', err.message);
  
  // Don't exit in production, just log the error
  if (process.env.NODE_ENV !== 'production') {
    console.error('💡 Make sure PostgreSQL is running and your .env file is configured correctly.');
  }
});

// Note: Connection will be tested on first query
// Use 'npm run test-db' to test the connection manually

module.exports = pool;

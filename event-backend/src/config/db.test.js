require('dotenv').config();
const pool = require('./db');

/**
 * Test database connection
 * Run this file to test if database connection is working
 */

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Database config:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS ? '***' : 'NOT SET'
    });

    // Test connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0].now);

    // Check if users table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Users table exists');
    } else {
      console.log('❌ Users table does NOT exist. Please run setup.sql');
    }

    // Check if events table exists
    const eventsTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'events'
      );
    `);
    
    if (eventsTableCheck.rows[0].exists) {
      console.log('✅ Events table exists');
    } else {
      console.log('❌ Events table does NOT exist. Please run setup.sql');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Solution: Make sure PostgreSQL is running and the host/port are correct.');
    } else if (error.code === '28P01') {
      console.error('\n💡 Solution: Check your database username and password in .env file.');
    } else if (error.code === '3D000') {
      console.error('\n💡 Solution: Create the database first: CREATE DATABASE ' + process.env.DB_NAME);
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Solution: Check your database host name in .env file.');
    }
    
    process.exit(1);
  }
}

testConnection();


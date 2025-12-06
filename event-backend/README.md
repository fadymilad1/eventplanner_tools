# Event Backend - Phase 0

Backend API for Event Planner System with JWT Authentication.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create PostgreSQL database:

```sql
CREATE DATABASE event_db;
```

Run the setup script:

```bash
psql -U postgres -d event_db -f setup.sql
```

Or manually execute the SQL from `setup.sql`

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DB_USER=postgres
DB_PASS=YOUR_PASSWORD
DB_NAME=event_db
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=mysecretkey
```

### 4. Run the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Register User
- **POST** `/api/auth/register`
- Body: `{ "email": "user@example.com", "password": "password123" }`
- Response: `{ "message": "User registered successfully", "user": {...} }`

### Login
- **POST** `/api/auth/login`
- Body: `{ "email": "user@example.com", "password": "password123" }`
- Response: `{ "message": "Login successful", "token": "jwt_token", "user": {...} }`

## Testing

Use Postman or curl to test the endpoints. See `POSTMAN_COLLECTION.md` for examples.

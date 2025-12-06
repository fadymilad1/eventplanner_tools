# Event Planner System - Phase 0

Complete authentication system with Node.js/Express backend and Angular frontend.

## 📁 Project Structure

```
phase-0/
├── event-backend/          # Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Database configuration
│   │   ├── models/
│   │   │   └── user.model.js      # User data model
│   │   ├── controllers/
│   │   │   └── auth.controller.js # Authentication logic
│   │   ├── routes/
│   │   │   └── auth.routes.js     # API routes
│   │   └── server.js              # Express server
│   ├── setup.sql                  # Database schema
│   ├── package.json
│   └── README.md
│
└── event-frontend/         # Angular
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   ├── login/         # Login component
    │   │   │   └── register/      # Register component
    │   │   ├── services/
    │   │   │   └── auth.service.ts # Authentication service
    │   │   ├── app.module.ts
    │   │   └── app.component.*
    │   ├── styles.css
    │   └── index.html
    ├── angular.json
    ├── package.json
    └── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Angular CLI (installed globally or via npm)

### Setup Instructions

#### 1. Backend Setup

```bash
cd event-backend

# Install dependencies
npm install

# Set up PostgreSQL database
# Create database
psql -U postgres
CREATE DATABASE event_db;
\q

# Run schema setup
psql -U postgres -d event_db -f setup.sql
```

**Create `.env` file:**
```env
PORT=5000
DB_USER=postgres
DB_PASS=YOUR_PASSWORD
DB_NAME=event_db
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=mysecretkey
```

#### 2. Frontend Setup

```bash
cd event-frontend

# Install dependencies
npm install

# Optional: Install Angular CLI globally
npm install -g @angular/cli
```

---

## ▶️ Running the Application

### Backend (Terminal 1)

```bash
cd event-backend
npm run dev
```

Backend runs on: `http://localhost:5000`

### Frontend (Terminal 2)

```bash
cd event-frontend
npm start
# or: ng serve
```

Frontend runs on: `http://localhost:4200`

---

## 🎯 Features

✅ User registration with email and password  
✅ User login with JWT authentication  
✅ Password hashing with bcrypt  
✅ JWT token generation and storage  
✅ Form validation  
✅ Success/error notifications  
✅ Modern, responsive UI  
✅ CORS configuration  
✅ Database connection pooling  

---

## 🧪 Testing

### Using Postman

See [POSTMAN_COLLECTION.md](./POSTMAN_COLLECTION.md) for detailed testing instructions.

### Quick Test

1. Open frontend: `http://localhost:4200`
2. Register a new user
3. Login with credentials
4. Check browser localStorage for JWT token

---

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Health check |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

**Backend Base URL:** `http://localhost:5000`

---

## 🔑 JWT Authentication Flow

1. User registers → Backend creates user with hashed password
2. User logs in → Backend validates credentials
3. Backend generates JWT token
4. Frontend stores token in localStorage
5. Token used for authenticated requests (future phases)

---

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- PostgreSQL
- bcrypt (password hashing)
- jsonwebtoken (JWT)
- pg (PostgreSQL driver)
- cors (Cross-Origin Resource Sharing)

### Frontend
- Angular 16
- TypeScript
- RxJS
- HttpClient
- Template-driven forms

---

## 📝 Notes

- JWT tokens expire after 24 hours
- Passwords are hashed with bcrypt (10 salt rounds)
- CORS is configured for localhost:4200 (Angular dev server)
- Database uses connection pooling for efficiency
- All endpoints are currently public (no middleware authentication)

---

## 🐛 Troubleshooting

**Backend won't start:**
- Check PostgreSQL is running
- Verify `.env` credentials are correct
- Ensure database exists

**Frontend connection errors:**
- Check backend is running on port 5000
- Verify CORS configuration
- Check browser console for errors

**Database errors:**
- Run `setup.sql` to create tables
- Verify database credentials in `.env`
- Check PostgreSQL is accessible

---

## 📚 Next Steps (Future Phases)

- Add JWT middleware for protected routes
- Create user profile page
- Add event management features
- Implement role-based access control
- Add password reset functionality
- Add email verification

---

## 📄 License

This project is part of an educational project.

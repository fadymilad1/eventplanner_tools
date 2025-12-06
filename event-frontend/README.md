# Event Frontend - Phase 0

Angular frontend for Event Planner System with User Authentication.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Application

Development server:
```bash
npm start
```

Or using Angular CLI:
```bash
ng serve
```

Application will run on `http://localhost:4200`

### 3. Build for Production

```bash
npm run build
```

## Features

- User Registration with email and password
- User Login with JWT authentication
- Token stored in localStorage
- Form validation
- Success/Error notifications
- Clean, modern UI with gradient design

## Project Structure

```
event-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── login.component.html
│   │   │   │   └── login.component.css
│   │   │   └── register/
│   │   │       ├── register.component.ts
│   │   │       ├── register.component.html
│   │   │       └── register.component.css
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   └── app.module.ts
│   ├── styles.css
│   └── index.html
├── angular.json
├── package.json
└── tsconfig.json
```

## API Integration

The frontend communicates with the backend API at:
- Base URL: `http://localhost:5000/api/auth`
- Register: `POST /register`
- Login: `POST /login`

JWT tokens are stored in localStorage for authenticated requests.

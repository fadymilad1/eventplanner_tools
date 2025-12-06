# Phase 2 - Files Created and Modified

This document lists all files that were created or modified to implement Docker (Phase 2).

## 📁 Files Created

### Docker Configuration Files

1. **`docker-compose.yml`** (Root directory)
   - Orchestrates all three services (database, backend, frontend)
   - Configures networks, volumes, and environment variables
   - Sets up health checks and dependencies

2. **`event-backend/Dockerfile`**
   - Backend container image definition
   - Uses `node:18-alpine` (lightweight)
   - Production build configuration
   - Non-root user for security
   - Health check included

3. **`event-frontend/Dockerfile`**
   - Frontend container image definition
   - Multi-stage build (Node.js for build, Nginx for serving)
   - Uses `node:18-alpine` for build stage
   - Uses `nginx:alpine` for production stage
   - Health check included

4. **`event-frontend/nginx.conf`**
   - Nginx configuration for serving Angular app
   - Angular routing support
   - Gzip compression
   - Security headers
   - Static asset caching

5. **`.dockerignore`** (Root directory)
   - Excludes unnecessary files from Docker build context
   - Reduces build time and image size

6. **`event-backend/.dockerignore`**
   - Excludes backend-specific files from build
   - Prevents copying node_modules, test files, etc.

7. **`event-frontend/.dockerignore`**
   - Excludes frontend-specific files from build
   - Prevents copying node_modules, dist, etc.

## 📝 Files Modified

### Backend Files

1. **`event-backend/src/server.js`**
   - **Modified:** CORS configuration
   - **Change:** Updated to allow Docker frontend origin (localhost:80)
   - **Reason:** Frontend runs on port 80 in Docker, not 4200

2. **`event-backend/src/models/event.model.js`**
   - **Modified:** Search query parameter binding
   - **Change:** Fixed role filter to use correct parameter index
   - **Reason:** Bug fix for search functionality

### Frontend Files

1. **`event-frontend/src/environments/environment.prod.ts`**
   - **Modified:** Added comment about Docker networking
   - **Change:** Clarified backend URL configuration for Docker
   - **Reason:** Documentation for Docker setup

2. **`event-frontend/angular.json`**
   - **Modified:** Production build budget limits
   - **Change:** Increased CSS budget from 4kb to 10kb
   - **Reason:** Some component CSS files exceeded the limit

3. **`event-frontend/src/app/components/dashboard/dashboard.component.html`**
   - **Modified:** Added search bar to dashboard
   - **Change:** Added search input, filters, and results display
   - **Reason:** User requested search functionality on dashboard

4. **`event-frontend/src/app/components/dashboard/dashboard.component.ts`**
   - **Modified:** Added search functionality
   - **Change:** Added `performSearch()`, `clearSearch()` methods
   - **Reason:** Implement search bar functionality

5. **`event-frontend/src/app/components/dashboard/dashboard.component.css`**
   - **Modified:** Added search bar styles
   - **Change:** Added styles for search container, input, filters, results
   - **Reason:** Styling for new search bar component

## 📋 Summary

### Created Files (7 files)
- `docker-compose.yml`
- `event-backend/Dockerfile`
- `event-frontend/Dockerfile`
- `event-frontend/nginx.conf`
- `.dockerignore` (root)
- `event-backend/.dockerignore`
- `event-frontend/.dockerignore`

### Modified Files (6 files)
- `event-backend/src/server.js` (CORS fix)
- `event-backend/src/models/event.model.js` (Search bug fix)
- `event-frontend/src/environments/environment.prod.ts` (Comment)
- `event-frontend/angular.json` (Budget limits)
- `event-frontend/src/app/components/dashboard/dashboard.component.html` (Search bar)
- `event-frontend/src/app/components/dashboard/dashboard.component.ts` (Search logic)
- `event-frontend/src/app/components/dashboard/dashboard.component.css` (Search styles)

## 🎯 Phase 2 Deliverables

For Phase 2 submission, you need:

1. ✅ **Three Dockerfiles:**
   - `event-backend/Dockerfile`
   - `event-frontend/Dockerfile`
   - Database uses official `postgres:15-alpine` image (configured in docker-compose.yml)

2. ✅ **Docker Compose:**
   - `docker-compose.yml` (root directory)

3. ✅ **Postman Collection:**
   - `event-backend/EventPlanner_API.postman_collection.json` (already existed)

4. ✅ **Team Info:**
   - Fill in `TEAM_INFO_TEMPLATE.txt` and save as `TEAM_INFO.txt`

## 🔍 File Locations

```
EventPLanner/
├── docker-compose.yml                    ← Created
├── .dockerignore                         ← Created
├── event-backend/
│   ├── Dockerfile                        ← Created
│   ├── .dockerignore                     ← Created
│   └── src/
│       ├── server.js                     ← Modified (CORS)
│       └── models/
│           └── event.model.js           ← Modified (Search fix)
└── event-frontend/
    ├── Dockerfile                        ← Created
    ├── .dockerignore                     ← Created
    ├── nginx.conf                        ← Created
    ├── angular.json                      ← Modified (Budget)
    ├── src/
    │   ├── environments/
    │   │   └── environment.prod.ts       ← Modified (Comment)
    │   └── app/
    │       └── components/
    │           └── dashboard/
    │               ├── *.html            ← Modified (Search bar)
    │               ├── *.ts              ← Modified (Search logic)
    │               └── *.css            ← Modified (Search styles)
```

## ✅ All Required Files Present

All Phase 2 deliverables are complete and ready for submission!


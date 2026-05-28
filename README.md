# Trao AI Trip Planner

Full-stack AI travel planner for the Trao engineering assessment.

Project folder: `Trao-AI-Trip-Planner/`

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Java 17, Spring Boot 3
- Security: Spring Security, JWT, BCrypt
- Database: MongoDB
- AI: Google Gemini API

## Features

- User registration and login
- Private user dashboard
- AI trip generation from destination, days, budget type, and interests
- Day-by-day itinerary
- Budget estimation
- Hotel suggestions
- Add/remove itinerary activities
- Regenerate a specific day
- Custom feature: Trip Quality Review
- User-scoped trip access to prevent cross-account data access

## Local Setup

Backend:

```bash
cd Trao-AI-Trip-Planner/backend
mvn test
mvn spring-boot:run
```

Frontend:

```bash
cd Trao-AI-Trip-Planner/frontend
npm install
npm run dev
```

Backend URL: `http://localhost:8080`  
Frontend URL: `http://localhost:3000`

## Environment

Backend env:

```env
MONGODB_URI=mongodb://localhost:27017/trip_planner
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRATION_MINUTES=10080
CORS_ALLOWED_ORIGINS=http://localhost:3000
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-2.5-flash
```

Frontend env:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Never commit real `.env` files.

## API Summary

Auth:

```text
POST /api/auth/register
POST /api/auth/login
```

Trips:

```text
GET    /api/trips
POST   /api/trips
GET    /api/trips/{tripId}
DELETE /api/trips/{tripId}
POST   /api/trips/{tripId}/days/{dayNumber}/regenerate
POST   /api/trips/{tripId}/days/{dayNumber}/activities
DELETE /api/trips/{tripId}/days/{dayNumber}/activities/{activityId}
```

Trip routes require `Authorization: Bearer <jwt>`.

## Deployment

- Backend: Render using `render.yaml`
- Frontend: Vercel with project root `Trao-AI-Trip-Planner/frontend`
- Database: MongoDB Atlas

Render backend env should include `MONGODB_URI`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`, and `GEMINI_API_KEY`.

Vercel frontend env should include:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-render-api.onrender.com
```

## Verification

Backend:

```text
mvn test
Tests run: 5, Failures: 0, Errors: 0
```

Frontend:

```text
npm run build
Next.js production build completed successfully.
npm audit
0 vulnerabilities
```

## Notes

The backend uses Spring Boot instead of the assessment's preferred Node/Express backend, per project decision. All other functional requirements remain covered. Public deployment links and walkthrough video should be produced after deploying with the required platform accounts.

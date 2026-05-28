# Trao AI Trip Planner

Full-stack implementation for the Trao engineering assessment.

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Java 17, Spring Boot 3
- Security: Spring Security, JWT, BCrypt
- Database: MongoDB
- AI: Google Gemini API
- Tooling: Maven, npm

## Backend Features

- User registration and login
- BCrypt password hashing
- JWT-based stateless authentication
- Protected trip APIs
- Strict user-level data isolation through `userId` scoped MongoDB queries
- AI itinerary generation with Gemini
- Day-by-day itinerary storage
- Budget estimation
- Hotel suggestions
- Editable itinerary activities
- Regenerate a specific itinerary day
- Custom creative feature: Trip Quality Review

## Frontend Features

- Register and login screens
- Authenticated dashboard
- Trip generation form
- Saved trip list
- Trip detail page
- Day-by-day itinerary view
- Add and remove activities
- Regenerate a specific day with custom instructions
- Budget, hotel, and trip quality review panels
- Responsive Tailwind UI with accessible form controls and icon buttons

## Architecture

```text
backend/
  src/main/java/com/trao/tripplanner/
    auth/       registration, login, auth DTOs
    security/   JWT creation and request authentication
    user/       user document and repository
    trip/       trip documents, DTOs, controller, service
    ai/         Gemini itinerary generation service
    common/     API error handling
frontend/
  src/app/
    login/      login route
    register/   registration route
    dashboard/  authenticated trip dashboard
    trips/[id]/ trip detail and editing route
  src/components/
  src/lib/
```

The controller layer accepts validated requests. The service layer owns business rules and authorization-safe lookups. The repository layer only exposes user-scoped reads for trip data.

## Environment Variables

Create backend environment variables from `backend/.env.example`.

Required for production:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRATION_MINUTES=10080
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

Never commit a real `.env` file. The repository intentionally tracks only `.env.example`.

Create frontend environment variables from `frontend/.env.example`.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Local Setup

Backend:

```bash
cd backend
mvn test
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

Health check:

```text
GET /actuator/health
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

## API Overview

Authentication:

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

All trip endpoints require:

```text
Authorization: Bearer <jwt>
```

## Example Requests

Register:

```json
{
  "name": "Lakshya",
  "email": "lakshya@example.com",
  "password": "password123"
}
```

Generate trip:

```json
{
  "destination": "Tokyo",
  "days": 3,
  "budgetType": "MEDIUM",
  "interests": ["Food", "Culture", "Shopping"]
}
```

Regenerate a day:

```json
{
  "instruction": "Regenerate this day with more outdoor activities and less shopping."
}
```

Add activity:

```json
{
  "timeOfDay": "Evening",
  "title": "Street food walk",
  "description": "Try local snacks near a popular market area.",
  "category": "Food",
  "estimatedCost": 25
}
```

## Gemini Agent Design

The backend calls Gemini through the REST `generateContent` endpoint and asks for strict JSON matching the backend trip schema. The default model is `gemini-2.5-flash`, aligned with Google's current Gemini text generation docs: https://ai.google.dev/gemini-api/docs/text-generation

When `GEMINI_API_KEY` is missing, the backend produces a local draft itinerary. This keeps local development usable, but real assessment demos should configure Gemini so generated trips are destination-specific.

## Authorization Approach

Trips are always read with `findByIdAndUserId` or `findByUserIdOrderByUpdatedAtDesc`. A valid JWT alone is not enough to access a trip; the trip must belong to the authenticated user.

## Deployment Notes

Recommended deployment:

- Backend: Render using `render.yaml`
- Frontend: Vercel with project root set to `frontend`
- Database: MongoDB Atlas
- AI: Gemini API key stored as a secret environment variable

Backend environment variables on Render:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=long-random-production-secret
JWT_EXPIRATION_MINUTES=10080
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-2.5-flash
```

Frontend environment variables on Vercel:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-render-api.onrender.com
```

## Verification

Current backend verification:

```text
mvn test
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
```

Current frontend verification:

```text
npm run build
Next.js production build completed successfully.
npm audit
0 vulnerabilities
```

## Known Limitations

- No refresh token flow yet; JWT expiry is controlled with `JWT_EXPIRATION_MINUTES`.
- Live Gemini behavior depends on the configured API key, model availability, and quota.
- End-to-end API tests with MongoDB Testcontainers can be added after the backend surface stabilizes.
- Public deployment URLs and walkthrough video must be produced after the app is deployed with your platform accounts.

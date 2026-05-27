# Trao AI Trip Planner

Backend-first implementation for the Trao full-stack engineering assessment.

Current status: the Spring Boot backend is implemented. The frontend will be added separately.

## Tech Stack

- Java 17
- Spring Boot 3
- Spring Security with JWT
- MongoDB
- Google Gemini API
- Maven

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

## Local Setup

From the backend folder:

```bash
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

Recommended backend deployment:

- Render, Railway, or Fly.io
- Java 17 runtime
- MongoDB Atlas connection string in `MONGODB_URI`
- Gemini key in `GEMINI_API_KEY`
- Frontend URL in `CORS_ALLOWED_ORIGINS`

## Verification

Current backend verification:

```text
mvn test
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
```

## Known Limitations

- Frontend is not implemented yet.
- No refresh token flow yet; JWT expiry is controlled with `JWT_EXPIRATION_MINUTES`.
- Live Gemini behavior depends on the configured API key, model availability, and quota.
- End-to-end API tests with MongoDB Testcontainers can be added after the backend surface stabilizes.

package com.trao.tripplanner.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trao.tripplanner.trip.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.trao.tripplanner.trip.TripDtos.*;

@Service
public class GeminiTripPlannerService {
    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String model;

    public GeminiTripPlannerService(
            RestClient.Builder restClientBuilder,
            ObjectMapper objectMapper,
            @Value("${gemini.api-key}") String apiKey,
            @Value("${gemini.model}") String model
    ) {
        this.restClient = restClientBuilder.build();
        this.objectMapper = objectMapper;
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.model = model;
    }

    public Trip generateTrip(GenerateTripRequest request) {
        if (apiKey.isBlank()) {
            return localDraftTrip(request);
        }

        String prompt = """
                You are an expert travel-planning agent. Create a practical trip plan as strict JSON.

                Inputs:
                - Destination: %s
                - Days: %d
                - Budget type: %s
                - Interests: %s

                Requirements:
                - Return JSON only. No markdown.
                - Create exactly %d itinerary days.
                - Include 3 to 5 activities per day.
                - Estimate realistic costs in USD.
                - Suggest 3 hotels aligned to budget and traveler ratings.
                - Add a trip quality review that explains pacing, budget fit, interest match, rest balance, strengths, warnings, and improvement ideas.

                JSON shape:
                {
                  "destination": "string",
                  "days": number,
                  "budgetType": "LOW|MEDIUM|HIGH",
                  "interests": ["string"],
                  "itinerary": [
                    {
                      "dayNumber": number,
                      "title": "string",
                      "summary": "string",
                      "activities": [
                        {
                          "timeOfDay": "Morning|Afternoon|Evening",
                          "title": "string",
                          "description": "string",
                          "category": "string",
                          "estimatedCost": number
                        }
                      ]
                    }
                  ],
                  "budgetEstimate": {
                    "currency": "USD",
                    "flights": number,
                    "accommodation": number,
                    "food": number,
                    "activities": number,
                    "localTransport": number,
                    "miscellaneous": number,
                    "total": number,
                    "notes": "string"
                  },
                  "hotels": [
                    {
                      "name": "string",
                      "priceLevel": "Budget|Mid Range|Luxury",
                      "neighborhood": "string",
                      "reason": "string",
                      "estimatedNightlyRate": number,
                      "ratingHint": "string"
                    }
                  ],
                  "qualityReview": {
                    "paceScore": number,
                    "budgetFit": "string",
                    "interestMatch": "string",
                    "restBalance": "string",
                    "strengths": ["string"],
                    "warnings": ["string"],
                    "improvementIdeas": ["string"]
                  }
                }
                """.formatted(
                request.destination(),
                request.days(),
                request.budgetType(),
                request.interests(),
                request.days()
        );

        Trip trip = readJson(callGemini(prompt), Trip.class);
        normalizeTrip(trip, request);
        return trip;
    }

    public ItineraryDay regenerateDay(Trip trip, int dayNumber, RegenerateDayRequest request) {
        if (apiKey.isBlank()) {
            return localRegeneratedDay(trip, dayNumber, request.instruction());
        }

        String prompt = """
                Regenerate one itinerary day as strict JSON only.

                Trip:
                - Destination: %s
                - Total days: %d
                - Budget type: %s
                - Interests: %s
                - Day to regenerate: %d
                - User instruction: %s

                Return exactly this JSON shape:
                {
                  "dayNumber": %d,
                  "title": "string",
                  "summary": "string",
                  "activities": [
                    {
                      "timeOfDay": "Morning|Afternoon|Evening",
                      "title": "string",
                      "description": "string",
                      "category": "string",
                      "estimatedCost": number
                    }
                  ]
                }
                """.formatted(
                trip.getDestination(),
                trip.getDays(),
                trip.getBudgetType(),
                trip.getInterests(),
                dayNumber,
                request.instruction(),
                dayNumber
        );

        ItineraryDay day = readJson(callGemini(prompt), ItineraryDay.class);
        day.setDayNumber(dayNumber);
        normalizeDay(day);
        return day;
    }

    private String callGemini(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s"
                .formatted(model, URLEncoder.encode(apiKey, StandardCharsets.UTF_8));

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("role", "user", "parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "responseMimeType", "application/json"
                )
        );

        String response = restClient.post()
                .uri(url)
                .body(body)
                .retrieve()
                .body(String.class);

        try {
            JsonNode root = objectMapper.readTree(response);
            return root.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text")
                    .asText();
        } catch (Exception exception) {
            throw new IllegalArgumentException("Gemini returned an unreadable response.");
        }
    }

    private <T> T readJson(String rawJson, Class<T> targetType) {
        try {
            String json = rawJson
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();
            return objectMapper.readValue(json, targetType);
        } catch (Exception exception) {
            throw new IllegalArgumentException("Gemini response did not match the expected itinerary format.");
        }
    }

    private void normalizeTrip(Trip trip, GenerateTripRequest request) {
        trip.setDestination(request.destination().trim());
        trip.setDays(request.days());
        trip.setBudgetType(request.budgetType());
        trip.setInterests(request.interests().stream().map(String::trim).toList());
        if (trip.getItinerary() == null) {
            trip.setItinerary(new ArrayList<>());
        }
        for (int i = 0; i < trip.getItinerary().size(); i++) {
            ItineraryDay day = trip.getItinerary().get(i);
            if (day.getDayNumber() <= 0) {
                day.setDayNumber(i + 1);
            }
            normalizeDay(day);
        }
        if (trip.getHotels() == null) {
            trip.setHotels(new ArrayList<>());
        }
        if (trip.getBudgetEstimate() == null) {
            trip.setBudgetEstimate(new BudgetEstimate());
        }
        if (trip.getQualityReview() == null) {
            trip.setQualityReview(new TripQualityReview());
        }
    }

    private void normalizeDay(ItineraryDay day) {
        if (day.getActivities() == null) {
            day.setActivities(new ArrayList<>());
        }
        for (Activity activity : day.getActivities()) {
            if (activity.getId() == null || activity.getId().isBlank()) {
                activity.setId(java.util.UUID.randomUUID().toString());
            }
            if (activity.getEstimatedCost() == null) {
                activity.setEstimatedCost(BigDecimal.ZERO);
            }
        }
    }

    private Trip localDraftTrip(GenerateTripRequest request) {
        Trip trip = new Trip();
        trip.setDestination(request.destination().trim());
        trip.setDays(request.days());
        trip.setBudgetType(request.budgetType());
        trip.setInterests(request.interests().stream().map(String::trim).toList());

        List<ItineraryDay> days = new ArrayList<>();
        for (int dayNumber = 1; dayNumber <= request.days(); dayNumber++) {
            days.add(localRegeneratedDay(trip, dayNumber, "Create a balanced day around " + request.interests()));
        }
        trip.setItinerary(days);
        trip.setBudgetEstimate(localBudget(request));
        trip.setHotels(localHotels(request));
        trip.setQualityReview(localReview(request));
        return trip;
    }

    private ItineraryDay localRegeneratedDay(Trip trip, int dayNumber, String instruction) {
        ItineraryDay day = new ItineraryDay();
        day.setDayNumber(dayNumber);
        day.setTitle("Day " + dayNumber + " in " + trip.getDestination());
        day.setSummary("A balanced day shaped around: " + instruction);

        Activity morning = new Activity();
        morning.setTimeOfDay("Morning");
        morning.setTitle("Neighborhood orientation walk");
        morning.setDescription("Start with a relaxed walk through a central neighborhood to understand the city rhythm.");
        morning.setCategory("Culture");
        morning.setEstimatedCost(BigDecimal.valueOf(15));

        Activity afternoon = new Activity();
        afternoon.setTimeOfDay("Afternoon");
        afternoon.setTitle("Local food and landmark stop");
        afternoon.setDescription("Pair a well-known landmark with a nearby local food area to reduce transit time.");
        afternoon.setCategory("Food");
        afternoon.setEstimatedCost(BigDecimal.valueOf(35));

        Activity evening = new Activity();
        evening.setTimeOfDay("Evening");
        evening.setTitle("Flexible evening experience");
        evening.setDescription("Choose a low-pressure evening activity so the day stays editable after travel fatigue.");
        evening.setCategory("Leisure");
        evening.setEstimatedCost(BigDecimal.valueOf(25));

        day.setActivities(List.of(morning, afternoon, evening));
        return day;
    }

    private BudgetEstimate localBudget(GenerateTripRequest request) {
        BigDecimal multiplier = switch (request.budgetType()) {
            case LOW -> BigDecimal.valueOf(0.8);
            case MEDIUM -> BigDecimal.valueOf(1.2);
            case HIGH -> BigDecimal.valueOf(2.0);
        };
        BigDecimal days = BigDecimal.valueOf(request.days());

        BudgetEstimate budget = new BudgetEstimate();
        budget.setFlights(BigDecimal.valueOf(400).multiply(multiplier));
        budget.setAccommodation(BigDecimal.valueOf(90).multiply(days).multiply(multiplier));
        budget.setFood(BigDecimal.valueOf(35).multiply(days).multiply(multiplier));
        budget.setActivities(BigDecimal.valueOf(45).multiply(days).multiply(multiplier));
        budget.setLocalTransport(BigDecimal.valueOf(20).multiply(days).multiply(multiplier));
        budget.setMiscellaneous(BigDecimal.valueOf(25).multiply(days));
        budget.setTotal(
                budget.getFlights()
                        .add(budget.getAccommodation())
                        .add(budget.getFood())
                        .add(budget.getActivities())
                        .add(budget.getLocalTransport())
                        .add(budget.getMiscellaneous())
        );
        budget.setNotes("Local draft estimate. Add GEMINI_API_KEY for live AI-generated costs.");
        return budget;
    }

    private List<HotelSuggestion> localHotels(GenerateTripRequest request) {
        HotelSuggestion hotel = new HotelSuggestion();
        hotel.setName(request.destination() + " Central Stay");
        hotel.setNeighborhood("Central district");
        hotel.setPriceLevel(switch (request.budgetType()) {
            case LOW -> "Budget";
            case MEDIUM -> "Mid Range";
            case HIGH -> "Luxury";
        });
        hotel.setReason("A practical placeholder near transit while Gemini is not configured.");
        hotel.setEstimatedNightlyRate(BigDecimal.valueOf(120));
        hotel.setRatingHint("Choose traveler-rated hotels above 4.0 when replacing this draft.");
        return List.of(hotel);
    }

    private TripQualityReview localReview(GenerateTripRequest request) {
        TripQualityReview review = new TripQualityReview();
        review.setPaceScore(78);
        review.setBudgetFit("Draft plan is budget-aware but should be validated by Gemini for live recommendations.");
        review.setInterestMatch("Activities are balanced around " + request.interests());
        review.setRestBalance("Each day keeps evening flexible to avoid overplanning.");
        review.setStrengths(List.of("Editable structure", "Balanced daily pacing"));
        review.setWarnings(List.of("Gemini API key is not configured, so this is a local draft."));
        review.setImprovementIdeas(List.of("Enable Gemini to produce destination-specific hotels and cost estimates."));
        return review;
    }
}

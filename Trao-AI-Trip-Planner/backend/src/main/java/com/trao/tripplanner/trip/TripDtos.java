package com.trao.tripplanner.trip;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class TripDtos {
    public record GenerateTripRequest(
            @NotBlank @Size(max = 120) String destination,
            @Min(1) @Max(21) int days,
            @NotNull BudgetType budgetType,
            @NotEmpty @Size(max = 10) List<@NotBlank @Size(max = 40) String> interests
    ) {
    }

    public record AddActivityRequest(
            @NotBlank @Size(max = 40) String timeOfDay,
            @NotBlank @Size(max = 120) String title,
            @NotBlank @Size(max = 500) String description,
            @Size(max = 40) String category,
            @DecimalMin("0.0") BigDecimal estimatedCost
    ) {
    }

    public record RegenerateDayRequest(
            @NotBlank @Size(max = 500) String instruction
    ) {
    }

    public record TripSummaryResponse(
            String id,
            String destination,
            int days,
            BudgetType budgetType,
            List<String> interests,
            Instant createdAt,
            Instant updatedAt
    ) {
    }

    public record TripResponse(
            String id,
            String destination,
            int days,
            BudgetType budgetType,
            List<String> interests,
            List<ItineraryDay> itinerary,
            BudgetEstimate budgetEstimate,
            List<HotelSuggestion> hotels,
            TripQualityReview qualityReview,
            Instant createdAt,
            Instant updatedAt
    ) {
    }
}

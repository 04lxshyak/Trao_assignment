package com.trao.tripplanner.trip;

import static com.trao.tripplanner.trip.TripDtos.*;

public class TripMapper {
    private TripMapper() {
    }

    public static TripSummaryResponse toSummary(Trip trip) {
        return new TripSummaryResponse(
                trip.getId(),
                trip.getDestination(),
                trip.getDays(),
                trip.getBudgetType(),
                trip.getInterests(),
                trip.getCreatedAt(),
                trip.getUpdatedAt()
        );
    }

    public static TripResponse toResponse(Trip trip) {
        return new TripResponse(
                trip.getId(),
                trip.getDestination(),
                trip.getDays(),
                trip.getBudgetType(),
                trip.getInterests(),
                trip.getItinerary(),
                trip.getBudgetEstimate(),
                trip.getHotels(),
                trip.getQualityReview(),
                trip.getCreatedAt(),
                trip.getUpdatedAt()
        );
    }
}

package com.trao.tripplanner.trip;

import com.trao.tripplanner.ai.GeminiTripPlannerService;
import com.trao.tripplanner.common.NotFoundException;
import com.trao.tripplanner.user.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static com.trao.tripplanner.trip.TripDtos.*;

@Service
public class TripService {
    private final TripRepository tripRepository;
    private final GeminiTripPlannerService geminiTripPlannerService;

    public TripService(TripRepository tripRepository, GeminiTripPlannerService geminiTripPlannerService) {
        this.tripRepository = tripRepository;
        this.geminiTripPlannerService = geminiTripPlannerService;
    }

    public List<TripSummaryResponse> listTrips(User user) {
        return tripRepository.findByUserIdOrderByUpdatedAtDesc(user.getId())
                .stream()
                .map(TripMapper::toSummary)
                .toList();
    }

    public TripResponse getTrip(User user, String tripId) {
        return TripMapper.toResponse(findOwnedTrip(user, tripId));
    }

    public TripResponse generateTrip(User user, GenerateTripRequest request) {
        Trip generatedTrip = geminiTripPlannerService.generateTrip(request);
        return TripMapper.toResponse(saveGeneratedTrip(user, request, generatedTrip));
    }

    public TripResponse regenerateDay(User user, String tripId, int dayNumber, RegenerateDayRequest request) {
        Trip trip = findOwnedTrip(user, tripId);
        ItineraryDay regeneratedDay = geminiTripPlannerService.regenerateDay(trip, dayNumber, request);
        return TripMapper.toResponse(replaceGeneratedDay(user, tripId, dayNumber, regeneratedDay));
    }

    public TripResponse addActivity(User user, String tripId, int dayNumber, AddActivityRequest request) {
        Trip trip = findOwnedTrip(user, tripId);
        ItineraryDay day = findDay(trip, dayNumber);

        Activity activity = new Activity();
        activity.setTimeOfDay(request.timeOfDay().trim());
        activity.setTitle(request.title().trim());
        activity.setDescription(request.description().trim());
        activity.setCategory(request.category() == null ? "Custom" : request.category().trim());
        activity.setEstimatedCost(request.estimatedCost() == null ? BigDecimal.ZERO : request.estimatedCost());

        day.getActivities().add(activity);
        return TripMapper.toResponse(saveTouched(trip));
    }

    public TripResponse removeActivity(User user, String tripId, int dayNumber, String activityId) {
        Trip trip = findOwnedTrip(user, tripId);
        ItineraryDay day = findDay(trip, dayNumber);
        boolean removed = day.getActivities().removeIf(activity -> activityId.equals(activity.getId()));
        if (!removed) {
            throw new IllegalArgumentException("Activity not found for this day.");
        }
        return TripMapper.toResponse(saveTouched(trip));
    }

    public void deleteTrip(User user, String tripId) {
        Trip trip = findOwnedTrip(user, tripId);
        tripRepository.delete(trip);
    }

    public Trip saveGeneratedTrip(User user, GenerateTripRequest request, Trip generatedTrip) {
        generatedTrip.setUserId(user.getId());
        generatedTrip.setDestination(request.destination().trim());
        generatedTrip.setDays(request.days());
        generatedTrip.setBudgetType(request.budgetType());
        generatedTrip.setInterests(request.interests().stream().map(String::trim).toList());
        generatedTrip.setCreatedAt(Instant.now());
        generatedTrip.setUpdatedAt(Instant.now());
        return tripRepository.save(generatedTrip);
    }

    public Trip replaceGeneratedDay(User user, String tripId, int dayNumber, ItineraryDay regeneratedDay) {
        Trip trip = findOwnedTrip(user, tripId);
        ItineraryDay existingDay = findDay(trip, dayNumber);
        regeneratedDay.setDayNumber(existingDay.getDayNumber());
        trip.getItinerary().set(trip.getItinerary().indexOf(existingDay), regeneratedDay);
        return saveTouched(trip);
    }

    private Trip findOwnedTrip(User user, String tripId) {
        return tripRepository.findByIdAndUserId(tripId, user.getId())
                .orElseThrow(() -> new NotFoundException("Trip not found."));
    }

    private ItineraryDay findDay(Trip trip, int dayNumber) {
        return trip.getItinerary()
                .stream()
                .filter(day -> day.getDayNumber() == dayNumber)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Day not found in itinerary."));
    }

    private Trip saveTouched(Trip trip) {
        trip.setUpdatedAt(Instant.now());
        return tripRepository.save(trip);
    }
}

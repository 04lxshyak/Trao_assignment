package com.trao.tripplanner.trip;

import com.trao.tripplanner.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.trao.tripplanner.trip.TripDtos.*;

@RestController
@RequestMapping("/api/trips")
public class TripController {
    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public List<TripSummaryResponse> listTrips(@AuthenticationPrincipal User user) {
        return tripService.listTrips(user);
    }

    @GetMapping("/{tripId}")
    public TripResponse getTrip(@AuthenticationPrincipal User user, @PathVariable String tripId) {
        return tripService.getTrip(user, tripId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TripResponse generateTrip(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody GenerateTripRequest request
    ) {
        return tripService.generateTrip(user, request);
    }

    @PostMapping("/{tripId}/days/{dayNumber}/regenerate")
    public TripResponse regenerateDay(
            @AuthenticationPrincipal User user,
            @PathVariable String tripId,
            @PathVariable int dayNumber,
            @Valid @RequestBody RegenerateDayRequest request
    ) {
        return tripService.regenerateDay(user, tripId, dayNumber, request);
    }

    @PostMapping("/{tripId}/days/{dayNumber}/activities")
    public TripResponse addActivity(
            @AuthenticationPrincipal User user,
            @PathVariable String tripId,
            @PathVariable int dayNumber,
            @Valid @RequestBody AddActivityRequest request
    ) {
        return tripService.addActivity(user, tripId, dayNumber, request);
    }

    @DeleteMapping("/{tripId}/days/{dayNumber}/activities/{activityId}")
    public TripResponse removeActivity(
            @AuthenticationPrincipal User user,
            @PathVariable String tripId,
            @PathVariable int dayNumber,
            @PathVariable String activityId
    ) {
        return tripService.removeActivity(user, tripId, dayNumber, activityId);
    }

    @DeleteMapping("/{tripId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTrip(@AuthenticationPrincipal User user, @PathVariable String tripId) {
        tripService.deleteTrip(user, tripId);
    }
}

package com.trao.tripplanner.trip;

import com.trao.tripplanner.ai.GeminiTripPlannerService;
import com.trao.tripplanner.common.NotFoundException;
import com.trao.tripplanner.user.User;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class TripServiceTest {
    private final TripRepository tripRepository = mock(TripRepository.class);
    private final GeminiTripPlannerService geminiTripPlannerService = mock(GeminiTripPlannerService.class);
    private final TripService tripService = new TripService(tripRepository, geminiTripPlannerService);

    @Test
    void listsOnlyTripsOwnedByAuthenticatedUser() {
        User user = user("user-1");
        Trip trip = trip("trip-1", "user-1");
        when(tripRepository.findByUserIdOrderByUpdatedAtDesc("user-1")).thenReturn(List.of(trip));

        List<TripDtos.TripSummaryResponse> trips = tripService.listTrips(user);

        assertThat(trips).hasSize(1);
        assertThat(trips.get(0).id()).isEqualTo("trip-1");
        verify(tripRepository).findByUserIdOrderByUpdatedAtDesc("user-1");
    }

    @Test
    void readsTripThroughUserScopedLookup() {
        User user = user("user-1");
        Trip trip = trip("trip-1", "user-1");
        when(tripRepository.findByIdAndUserId("trip-1", "user-1")).thenReturn(Optional.of(trip));

        TripDtos.TripResponse response = tripService.getTrip(user, "trip-1");

        assertThat(response.id()).isEqualTo("trip-1");
        verify(tripRepository).findByIdAndUserId("trip-1", "user-1");
        verify(tripRepository, never()).findById("trip-1");
    }

    @Test
    void rejectsAccessWhenTripIsNotOwnedByAuthenticatedUser() {
        User user = user("user-1");
        when(tripRepository.findByIdAndUserId("trip-2", "user-1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tripService.getTrip(user, "trip-2"))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("Trip not found");

        verify(tripRepository).findByIdAndUserId("trip-2", "user-1");
        verify(tripRepository, never()).findById("trip-2");
    }

    private User user(String id) {
        User user = new User();
        user.setId(id);
        user.setName("Traveler");
        user.setEmail(id + "@example.com");
        return user;
    }

    private Trip trip(String id, String userId) {
        Trip trip = new Trip();
        trip.setId(id);
        trip.setUserId(userId);
        trip.setDestination("Tokyo");
        trip.setDays(3);
        trip.setBudgetType(BudgetType.MEDIUM);
        trip.setInterests(List.of("Food", "Culture"));
        trip.setCreatedAt(Instant.now());
        trip.setUpdatedAt(Instant.now());
        return trip;
    }
}

package com.trao.tripplanner.trip;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TripRepository extends MongoRepository<Trip, String> {
    List<Trip> findByUserIdOrderByUpdatedAtDesc(String userId);

    Optional<Trip> findByIdAndUserId(String id, String userId);
}

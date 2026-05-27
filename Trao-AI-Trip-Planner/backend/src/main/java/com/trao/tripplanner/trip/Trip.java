package com.trao.tripplanner.trip;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document("trips")
@CompoundIndex(name = "user_updated_idx", def = "{'userId': 1, 'updatedAt': -1}")
public class Trip {
    @Id
    private String id;
    private String userId;
    private String destination;
    private int days;
    private BudgetType budgetType;
    private List<String> interests = new ArrayList<>();
    private List<ItineraryDay> itinerary = new ArrayList<>();
    private BudgetEstimate budgetEstimate;
    private List<HotelSuggestion> hotels = new ArrayList<>();
    private TripQualityReview qualityReview;
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public int getDays() {
        return days;
    }

    public void setDays(int days) {
        this.days = days;
    }

    public BudgetType getBudgetType() {
        return budgetType;
    }

    public void setBudgetType(BudgetType budgetType) {
        this.budgetType = budgetType;
    }

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests == null ? new ArrayList<>() : interests;
    }

    public List<ItineraryDay> getItinerary() {
        return itinerary;
    }

    public void setItinerary(List<ItineraryDay> itinerary) {
        this.itinerary = itinerary == null ? new ArrayList<>() : itinerary;
    }

    public BudgetEstimate getBudgetEstimate() {
        return budgetEstimate;
    }

    public void setBudgetEstimate(BudgetEstimate budgetEstimate) {
        this.budgetEstimate = budgetEstimate;
    }

    public List<HotelSuggestion> getHotels() {
        return hotels;
    }

    public void setHotels(List<HotelSuggestion> hotels) {
        this.hotels = hotels == null ? new ArrayList<>() : hotels;
    }

    public TripQualityReview getQualityReview() {
        return qualityReview;
    }

    public void setQualityReview(TripQualityReview qualityReview) {
        this.qualityReview = qualityReview;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}

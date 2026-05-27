package com.trao.tripplanner.trip;

import java.math.BigDecimal;

public class HotelSuggestion {
    private String name;
    private String priceLevel;
    private String neighborhood;
    private String reason;
    private BigDecimal estimatedNightlyRate = BigDecimal.ZERO;
    private String ratingHint;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPriceLevel() {
        return priceLevel;
    }

    public void setPriceLevel(String priceLevel) {
        this.priceLevel = priceLevel;
    }

    public String getNeighborhood() {
        return neighborhood;
    }

    public void setNeighborhood(String neighborhood) {
        this.neighborhood = neighborhood;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public BigDecimal getEstimatedNightlyRate() {
        return estimatedNightlyRate;
    }

    public void setEstimatedNightlyRate(BigDecimal estimatedNightlyRate) {
        this.estimatedNightlyRate = estimatedNightlyRate;
    }

    public String getRatingHint() {
        return ratingHint;
    }

    public void setRatingHint(String ratingHint) {
        this.ratingHint = ratingHint;
    }
}

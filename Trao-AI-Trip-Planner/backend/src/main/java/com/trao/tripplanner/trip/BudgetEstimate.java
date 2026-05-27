package com.trao.tripplanner.trip;

import java.math.BigDecimal;

public class BudgetEstimate {
    private String currency = "USD";
    private BigDecimal flights = BigDecimal.ZERO;
    private BigDecimal accommodation = BigDecimal.ZERO;
    private BigDecimal food = BigDecimal.ZERO;
    private BigDecimal activities = BigDecimal.ZERO;
    private BigDecimal localTransport = BigDecimal.ZERO;
    private BigDecimal miscellaneous = BigDecimal.ZERO;
    private BigDecimal total = BigDecimal.ZERO;
    private String notes;

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getFlights() {
        return flights;
    }

    public void setFlights(BigDecimal flights) {
        this.flights = flights;
    }

    public BigDecimal getAccommodation() {
        return accommodation;
    }

    public void setAccommodation(BigDecimal accommodation) {
        this.accommodation = accommodation;
    }

    public BigDecimal getFood() {
        return food;
    }

    public void setFood(BigDecimal food) {
        this.food = food;
    }

    public BigDecimal getActivities() {
        return activities;
    }

    public void setActivities(BigDecimal activities) {
        this.activities = activities;
    }

    public BigDecimal getLocalTransport() {
        return localTransport;
    }

    public void setLocalTransport(BigDecimal localTransport) {
        this.localTransport = localTransport;
    }

    public BigDecimal getMiscellaneous() {
        return miscellaneous;
    }

    public void setMiscellaneous(BigDecimal miscellaneous) {
        this.miscellaneous = miscellaneous;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

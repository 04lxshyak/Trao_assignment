package com.trao.tripplanner.trip;

import java.util.ArrayList;
import java.util.List;

public class ItineraryDay {
    private int dayNumber;
    private String title;
    private String summary;
    private List<Activity> activities = new ArrayList<>();

    public int getDayNumber() {
        return dayNumber;
    }

    public void setDayNumber(int dayNumber) {
        this.dayNumber = dayNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<Activity> getActivities() {
        return activities;
    }

    public void setActivities(List<Activity> activities) {
        this.activities = activities == null ? new ArrayList<>() : activities;
    }
}

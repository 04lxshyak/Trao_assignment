package com.trao.tripplanner.trip;

import java.util.ArrayList;
import java.util.List;

public class TripQualityReview {
    private int paceScore;
    private String budgetFit;
    private String interestMatch;
    private String restBalance;
    private List<String> strengths = new ArrayList<>();
    private List<String> warnings = new ArrayList<>();
    private List<String> improvementIdeas = new ArrayList<>();

    public int getPaceScore() {
        return paceScore;
    }

    public void setPaceScore(int paceScore) {
        this.paceScore = paceScore;
    }

    public String getBudgetFit() {
        return budgetFit;
    }

    public void setBudgetFit(String budgetFit) {
        this.budgetFit = budgetFit;
    }

    public String getInterestMatch() {
        return interestMatch;
    }

    public void setInterestMatch(String interestMatch) {
        this.interestMatch = interestMatch;
    }

    public String getRestBalance() {
        return restBalance;
    }

    public void setRestBalance(String restBalance) {
        this.restBalance = restBalance;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths == null ? new ArrayList<>() : strengths;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings == null ? new ArrayList<>() : warnings;
    }

    public List<String> getImprovementIdeas() {
        return improvementIdeas;
    }

    public void setImprovementIdeas(List<String> improvementIdeas) {
        this.improvementIdeas = improvementIdeas == null ? new ArrayList<>() : improvementIdeas;
    }
}

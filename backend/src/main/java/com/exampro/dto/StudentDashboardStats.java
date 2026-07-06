package com.exampro.dto;

import java.util.List;

public class StudentDashboardStats {
    private Long upcomingExamsCount;
    private Long completedExamsCount;
    private Double averageScore;
    private List<ResultResponse> recentScores;

    public StudentDashboardStats() {
    }

    public StudentDashboardStats(Long upcomingExamsCount, Long completedExamsCount, Double averageScore, List<ResultResponse> recentScores) {
        this.upcomingExamsCount = upcomingExamsCount;
        this.completedExamsCount = completedExamsCount;
        this.averageScore = averageScore;
        this.recentScores = recentScores;
    }

    // Getters and Setters
    public Long getUpcomingExamsCount() {
        return upcomingExamsCount;
    }

    public void setUpcomingExamsCount(Long upcomingExamsCount) {
        this.upcomingExamsCount = upcomingExamsCount;
    }

    public Long getCompletedExamsCount() {
        return completedExamsCount;
    }

    public void setCompletedExamsCount(Long completedExamsCount) {
        this.completedExamsCount = completedExamsCount;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public List<ResultResponse> getRecentScores() {
        return recentScores;
    }

    public void setRecentScores(List<ResultResponse> recentScores) {
        this.recentScores = recentScores;
    }
}

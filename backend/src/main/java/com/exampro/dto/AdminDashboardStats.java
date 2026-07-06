package com.exampro.dto;

import java.util.List;

public class AdminDashboardStats {
    private Long totalStudents;
    private Long totalExams;
    private Long activeExams;
    private Long completedExams;
    private List<ResultResponse> recentActivities;

    public AdminDashboardStats() {
    }

    public AdminDashboardStats(Long totalStudents, Long totalExams, Long activeExams, Long completedExams, List<ResultResponse> recentActivities) {
        this.totalStudents = totalStudents;
        this.totalExams = totalExams;
        this.activeExams = activeExams;
        this.completedExams = completedExams;
        this.recentActivities = recentActivities;
    }

    // Getters and Setters
    public Long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(Long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public Long getTotalExams() {
        return totalExams;
    }

    public void setTotalExams(Long totalExams) {
        this.totalExams = totalExams;
    }

    public Long getActiveExams() {
        return activeExams;
    }

    public void setActiveExams(Long activeExams) {
        this.activeExams = activeExams;
    }

    public Long getCompletedExams() {
        return completedExams;
    }

    public void setCompletedExams(Long completedExams) {
        this.completedExams = completedExams;
    }

    public List<ResultResponse> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<ResultResponse> recentActivities) {
        this.recentActivities = recentActivities;
    }
}

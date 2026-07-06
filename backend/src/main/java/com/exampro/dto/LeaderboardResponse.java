package com.exampro.dto;

import java.time.LocalDateTime;

public class LeaderboardResponse {
    private Long id;
    private String studentName;
    private String examTitle;
    private Double topScore;
    private Double percentage;
    private Integer rank;
    private LocalDateTime updatedAt;

    public LeaderboardResponse() {
    }

    public LeaderboardResponse(Long id, String studentName, String examTitle, Double topScore, Double percentage, Integer rank, LocalDateTime updatedAt) {
        this.id = id;
        this.studentName = studentName;
        this.examTitle = examTitle;
        this.topScore = topScore;
        this.percentage = percentage;
        this.rank = rank;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getExamTitle() {
        return examTitle;
    }

    public void setExamTitle(String examTitle) {
        this.examTitle = examTitle;
    }

    public Double getTopScore() {
        return topScore;
    }

    public void setTopScore(Double topScore) {
        this.topScore = topScore;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

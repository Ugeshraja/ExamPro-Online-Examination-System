package com.exampro.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leaderboard", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "exam_id"})
})
public class Leaderboard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @Column(name = "top_score", nullable = false)
    private Double topScore;

    @Column(nullable = false)
    private Double percentage;

    @Column(name = "`rank`", nullable = false)
    private Integer rank;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Leaderboard() {
    }

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
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

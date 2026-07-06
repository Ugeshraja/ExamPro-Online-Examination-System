package com.exampro.controller;

import com.exampro.dto.AdminDashboardStats;
import com.exampro.dto.ResultResponse;
import com.exampro.dto.StudentDashboardStats;
import com.exampro.security.UserPrincipal;
import com.exampro.service.ExamService;
import com.exampro.service.ResultService;
import com.exampro.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserService userService;
    private final ExamService examService;
    private final ResultService resultService;

    public DashboardController(UserService userService,
                               ExamService examService,
                               ResultService resultService) {
        this.userService = userService;
        this.examService = examService;
        this.resultService = resultService;
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardStats> getAdminStats() {
        long totalStudents = userService.countStudents();
        long totalExams = examService.countTotalExams();
        long activeExams = examService.countActiveExams();
        long completedExams = examService.countCompletedExams();
        List<ResultResponse> recentActivities = resultService.getRecentResults(5);

        return ResponseEntity.ok(new AdminDashboardStats(
                totalStudents,
                totalExams,
                activeExams,
                completedExams,
                recentActivities
        ));
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentDashboardStats> getStudentStats(@AuthenticationPrincipal UserPrincipal currentUser) {
        long upcomingCount = examService.getPublishedExams().size(); // Simplify as all published exams
        List<ResultResponse> myResults = resultService.getResultsByStudentId(currentUser.getId());
        long completedCount = myResults.size();
        Double averageScore = resultService.getAverageScoreForStudent(currentUser.getId());
        List<ResultResponse> recentScores = myResults.stream()
                .sorted((r1, r2) -> r2.getSubmittedAt().compareTo(r1.getSubmittedAt()))
                .limit(5)
                .toList();

        return ResponseEntity.ok(new StudentDashboardStats(
                upcomingCount,
                completedCount,
                averageScore,
                recentScores
        ));
    }
}

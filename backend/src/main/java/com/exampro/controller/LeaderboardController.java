package com.exampro.controller;

import com.exampro.dto.LeaderboardResponse;
import com.exampro.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/exams/{examId}")
    public ResponseEntity<List<LeaderboardResponse>> getLeaderboardByExam(@PathVariable Long examId) {
        return ResponseEntity.ok(leaderboardService.getLeaderboardByExamId(examId));
    }

    @GetMapping("/global")
    public ResponseEntity<List<LeaderboardResponse>> getGlobalLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getAllLeaderboardEntries());
    }
}

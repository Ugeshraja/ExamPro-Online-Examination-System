package com.exampro.controller;

import com.exampro.dto.ExamSubmissionRequest;
import com.exampro.dto.ResultResponse;
import com.exampro.security.UserPrincipal;
import com.exampro.service.ResultService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @PostMapping("/exams/{examId}/submit")
    public ResponseEntity<ResultResponse> submitExam(@PathVariable Long examId,
                                                     @RequestBody ExamSubmissionRequest submission,
                                                     @AuthenticationPrincipal UserPrincipal currentUser) {
        // Enforce student's own ID from JWT principal for evaluation
        ResultResponse response = resultService.evaluateSubmission(currentUser.getId(), examId, submission);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ResultResponse>> getMyResults(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(resultService.getResultsByStudentId(currentUser.getId()));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ResultResponse>> getStudentResults(@PathVariable Long studentId) {
        return ResponseEntity.ok(resultService.getResultsByStudentId(studentId));
    }

    @GetMapping("/exams/{examId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ResultResponse>> getResultsByExam(@PathVariable Long examId) {
        return ResponseEntity.ok(resultService.getResultsByExamId(examId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultResponse> getResultById(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal currentUser) {
        ResultResponse response = resultService.getResultById(id);
        // Student can only see their own result, Admin can see any
        if (currentUser.getUser().getRole().equals("STUDENT") && !response.getStudentId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(response);
    }
}

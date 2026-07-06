package com.exampro.controller;

import com.exampro.dto.ExamRequest;
import com.exampro.entity.Exam;
import com.exampro.security.UserPrincipal;
import com.exampro.service.ExamService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @GetMapping
    public ResponseEntity<List<Exam>> getAllExams(@AuthenticationPrincipal UserPrincipal currentUser) {
        // Students only get published exams, Admins get all exams
        if (currentUser.getUser().getRole().equals("ADMIN")) {
            return ResponseEntity.ok(examService.getAllExams());
        } else {
            return ResponseEntity.ok(examService.getPublishedExams());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable Long id) {
        return ResponseEntity.ok(examService.getExamById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Exam> createExam(@RequestBody ExamRequest examRequest) {
        return ResponseEntity.ok(examService.createExam(examRequest));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Exam> updateExam(@PathVariable Long id, @RequestBody ExamRequest examRequest) {
        return ResponseEntity.ok(examService.updateExam(id, examRequest));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Exam deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Exam> publishExam(@PathVariable Long id, @RequestParam("status") Boolean isPublished) {
        return ResponseEntity.ok(examService.publishExam(id, isPublished));
    }
}

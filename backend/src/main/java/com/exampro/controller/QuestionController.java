package com.exampro.controller;

import com.exampro.dto.QuestionRequest;
import com.exampro.entity.Option;
import com.exampro.entity.Question;
import com.exampro.security.UserPrincipal;
import com.exampro.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/exams/{examId}/questions")
    public ResponseEntity<List<Question>> getQuestionsByExam(@PathVariable Long examId, @AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser.getUser().getRole().equals("ADMIN")) {
            // Admins get everything (ordered as in DB)
            return ResponseEntity.ok(questionService.getQuestionsByExamId(examId));
        } else {
            // Students get randomized questions and options, with correctness masked to prevent cheating
            List<Question> questions = questionService.getQuestionsForExamSession(examId);
            for (Question q : questions) {
                if (q.getOptions() != null) {
                    for (Option o : q.getOptions()) {
                        o.setIsCorrect(false); // Masking actual correctness flag
                    }
                }
            }
            return ResponseEntity.ok(questions);
        }
    }

    @GetMapping("/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @PostMapping("/exams/{examId}/questions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Question> createQuestion(@PathVariable Long examId, @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(questionService.createQuestion(examId, request));
    }

    @PutMapping("/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(questionService.updateQuestion(id, request));
    }

    @DeleteMapping("/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Question deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/exams/{examId}/questions/import")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Question>> importQuestions(@PathVariable Long examId, @RequestBody List<QuestionRequest> requests) {
        return ResponseEntity.ok(questionService.importQuestions(examId, requests));
    }

    @GetMapping("/questions/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Question>> searchQuestions(@RequestParam("q") String query) {
        return ResponseEntity.ok(questionService.searchQuestions(query));
    }
}

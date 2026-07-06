package com.exampro.service;

import com.exampro.dto.ExamSubmissionRequest;
import com.exampro.dto.ResultResponse;
import com.exampro.entity.Exam;
import com.exampro.entity.Option;
import com.exampro.entity.Question;
import com.exampro.entity.Result;
import com.exampro.entity.User;
import com.exampro.exception.ResourceNotFoundException;
import com.exampro.repository.ExamRepository;
import com.exampro.repository.QuestionRepository;
import com.exampro.repository.ResultRepository;
import com.exampro.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResultService {

    private final ResultRepository resultRepository;
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final LeaderboardService leaderboardService;

    public ResultService(ResultRepository resultRepository,
                         ExamRepository examRepository,
                         QuestionRepository questionRepository,
                         UserRepository userRepository,
                         LeaderboardService leaderboardService) {
        this.resultRepository = resultRepository;
        this.examRepository = examRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.leaderboardService = leaderboardService;
    }

    public List<ResultResponse> getResultsByStudentId(Long studentId) {
        return resultRepository.findByStudentId(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ResultResponse> getResultsByExamId(Long examId) {
        return resultRepository.findByExamId(examId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ResultResponse getResultById(Long id) {
        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Result", "id", id));
        return mapToResponse(result);
    }

    @Transactional
    public ResultResponse evaluateSubmission(Long studentId, Long examId, ExamSubmissionRequest submission) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", studentId));
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam", "id", examId));

        List<Question> questions = questionRepository.findByExamId(examId);

        double score = 0.0;
        double maxPossibleMarks = 0.0;
        int correctAnswers = 0;
        int wrongAnswers = 0;
        int skippedQuestions = 0;

        Map<Long, Long> answers = submission.getAnswers(); // QuestionID -> SelectedOptionID

        for (Question question : questions) {
            maxPossibleMarks += question.getMarks();
            Long selectedOptionId = (answers != null) ? answers.get(question.getId()) : null;

            if (selectedOptionId == null) {
                skippedQuestions++;
            } else {
                // Find correct option for this question
                Option correctOption = question.getOptions().stream()
                        .filter(Option::getIsCorrect)
                        .findFirst()
                        .orElse(null);

                if (correctOption != null && correctOption.getId().equals(selectedOptionId)) {
                    correctAnswers++;
                    score += question.getMarks();
                } else {
                    wrongAnswers++;
                    score -= question.getNegativeMarks();
                }
            }
        }

        // Percentage calculation
        double percentage = 0.0;
        if (maxPossibleMarks > 0) {
            percentage = (score / maxPossibleMarks) * 100.0;
        }
        percentage = Math.max(0.0, Math.min(100.0, percentage)); // Bind percentage between 0 and 100

        String status = (percentage >= exam.getPassingMarks()) ? "PASS" : "FAIL";

        Result result = new Result();
        result.setStudent(student);
        result.setExam(exam);
        result.setScore(score);
        result.setPercentage(percentage);
        result.setCorrectAnswers(correctAnswers);
        result.setWrongAnswers(wrongAnswers);
        result.setSkippedQuestions(skippedQuestions);
        result.setTimeTakenSeconds(submission.getTimeTakenSeconds() != null ? submission.getTimeTakenSeconds() : 0);
        result.setStatus(status);

        Result savedResult = resultRepository.save(result);

        // Update leaderboard
        leaderboardService.updateLeaderboard(studentId, examId, score, percentage);

        return mapToResponse(savedResult);
    }

    public List<ResultResponse> getRecentResults(int limit) {
        return resultRepository.findAll().stream()
                .sorted((r1, r2) -> r2.getSubmittedAt().compareTo(r1.getSubmittedAt()))
                .limit(limit)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Double getAverageScoreForStudent(Long studentId) {
        List<Result> results = resultRepository.findByStudentId(studentId);
        if (results.isEmpty()) {
            return 0.0;
        }
        return results.stream().mapToDouble(Result::getScore).average().orElse(0.0);
    }

    public ResultResponse mapToResponse(Result result) {
        ResultResponse response = new ResultResponse();
        response.setId(result.getId());
        response.setExamId(result.getExam().getId());
        response.setExamTitle(result.getExam().getTitle());
        response.setStudentId(result.getStudent().getId());
        response.setStudentName(result.getStudent().getName());
        response.setScore(result.getScore());
        response.setPercentage(result.getPercentage());
        response.setCorrectAnswers(result.getCorrectAnswers());
        response.setWrongAnswers(result.getWrongAnswers());
        response.setSkippedQuestions(result.getSkippedQuestions());
        response.setTimeTakenSeconds(result.getTimeTakenSeconds());
        response.setStatus(result.getStatus());
        response.setSubmittedAt(result.getSubmittedAt());
        return response;
    }
}

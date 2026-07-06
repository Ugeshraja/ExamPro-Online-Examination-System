package com.exampro.service;

import com.exampro.dto.OptionRequest;
import com.exampro.dto.QuestionRequest;
import com.exampro.entity.Exam;
import com.exampro.entity.Option;
import com.exampro.entity.Question;
import com.exampro.exception.BadRequestException;
import com.exampro.exception.ResourceNotFoundException;
import com.exampro.repository.ExamRepository;
import com.exampro.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final ExamRepository examRepository;

    public QuestionService(QuestionRepository questionRepository, ExamRepository examRepository) {
        this.questionRepository = questionRepository;
        this.examRepository = examRepository;
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public List<Question> getQuestionsByExamId(Long examId) {
        return questionRepository.findByExamId(examId);
    }

    public List<Question> getQuestionsForExamSession(Long examId) {
        List<Question> questions = questionRepository.findByExamId(examId);
        // Randomize questions for the exam session
        Collections.shuffle(questions);
        
        // Also randomize options for each question
        for (Question q : questions) {
            if (q.getOptions() != null) {
                Collections.shuffle(q.getOptions());
            }
        }
        return questions;
    }

    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", id));
    }

    @Transactional
    public Question createQuestion(Long examId, QuestionRequest request) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam", "id", examId));

        Question question = new Question();
        question.setExam(exam);
        copyRequestToEntity(request, question);

        return questionRepository.save(question);
    }

    @Transactional
    public Question updateQuestion(Long id, QuestionRequest request) {
        Question question = getQuestionById(id);
        copyRequestToEntity(request, question);
        return questionRepository.save(question);
    }

    @Transactional
    public void deleteQuestion(Long id) {
        Question question = getQuestionById(id);
        questionRepository.delete(question);
    }

    @Transactional
    public List<Question> importQuestions(Long examId, List<QuestionRequest> requests) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam", "id", examId));

        List<Question> savedQuestions = new ArrayList<>();
        for (QuestionRequest request : requests) {
            Question question = new Question();
            question.setExam(exam);
            copyRequestToEntity(request, question);
            savedQuestions.add(questionRepository.save(question));
        }
        return savedQuestions;
    }

    private void copyRequestToEntity(QuestionRequest request, Question question) {
        question.setQuestionText(request.getQuestionText());
        question.setMarks(request.getMarks() != null ? request.getMarks() : 1.0);
        question.setNegativeMarks(request.getNegativeMarks() != null ? request.getNegativeMarks() : 0.0);
        question.setDifficulty(request.getDifficulty());
        question.setCategory(request.getCategory());

        // Recreate options
        question.getOptions().clear();
        if (request.getOptions() != null) {
            if (request.getOptions().size() != 4) {
                throw new BadRequestException("Each MCQ question must have exactly 4 options.");
            }

            long correctCount = request.getOptions().stream().filter(OptionRequest::getIsCorrect).count();
            if (correctCount != 1) {
                throw new BadRequestException("Each MCQ question must have exactly one correct option.");
            }

            for (OptionRequest optReq : request.getOptions()) {
                Option option = new Option(optReq.getOptionText(), optReq.getIsCorrect());
                question.addOption(option);
            }
        }
    }

    public List<Question> searchQuestions(String query) {
        return questionRepository.findAll().stream()
                .filter(q -> q.getQuestionText().toLowerCase().contains(query.toLowerCase()) || 
                             q.getCategory().toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
    }
}

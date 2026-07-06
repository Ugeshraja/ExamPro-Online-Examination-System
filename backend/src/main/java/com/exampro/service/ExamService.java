package com.exampro.service;

import com.exampro.dto.ExamRequest;
import com.exampro.entity.Exam;
import com.exampro.exception.ResourceNotFoundException;
import com.exampro.repository.ExamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExamService {

    private final ExamRepository examRepository;

    public ExamService(ExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public List<Exam> getPublishedExams() {
        return examRepository.findByIsPublished(true);
    }

    public Exam getExamById(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam", "id", id));
    }

    @Transactional
    public Exam createExam(ExamRequest examRequest) {
        Exam exam = new Exam();
        copyRequestToEntity(examRequest, exam);
        return examRepository.save(exam);
    }

    @Transactional
    public Exam updateExam(Long id, ExamRequest examRequest) {
        Exam exam = getExamById(id);
        copyRequestToEntity(examRequest, exam);
        return examRepository.save(exam);
    }

    @Transactional
    public void deleteExam(Long id) {
        Exam exam = getExamById(id);
        examRepository.delete(exam);
    }

    @Transactional
    public Exam publishExam(Long id, Boolean isPublished) {
        Exam exam = getExamById(id);
        exam.setIsPublished(isPublished);
        return examRepository.save(exam);
    }

    private void copyRequestToEntity(ExamRequest request, Exam exam) {
        exam.setTitle(request.getTitle());
        exam.setDescription(request.getDescription());
        exam.setDurationMinutes(request.getDurationMinutes());
        exam.setPassingMarks(request.getPassingMarks());
        exam.setTotalQuestions(request.getTotalQuestions());
        exam.setIsPublished(request.getIsPublished());
        exam.setScheduleTime(request.getScheduleTime());
    }

    public long countTotalExams() {
        return examRepository.count();
    }

    public long countActiveExams() {
        // Active exams are published exams that are either scheduled in the past or have no schedule time
        return examRepository.findByIsPublished(true).stream()
                .filter(e -> e.getScheduleTime() == null || e.getScheduleTime().isBefore(LocalDateTime.now()))
                .count();
    }

    public long countCompletedExams() {
        // Just return a count of published exams whose schedules have finished (schedule + duration is in the past)
        return examRepository.findByIsPublished(true).stream()
                .filter(e -> e.getScheduleTime() != null && 
                             e.getScheduleTime().plusMinutes(e.getDurationMinutes()).isBefore(LocalDateTime.now()))
                .count();
    }
}

package com.exampro.repository;

import com.exampro.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByIsPublished(Boolean isPublished);
    long countByIsPublished(Boolean isPublished);
}

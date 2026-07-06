package com.exampro.repository;

import com.exampro.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudentId(Long studentId);
    List<Result> findByExamId(Long examId);
    List<Result> findByExamIdOrderByScoreDesc(Long examId);
    long countByStudentId(Long studentId);
    Optional<Result> findFirstByStudentIdAndExamIdOrderByScoreDesc(Long studentId, Long examId);
}

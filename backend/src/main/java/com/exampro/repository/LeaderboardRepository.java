package com.exampro.repository;

import com.exampro.entity.Leaderboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaderboardRepository extends JpaRepository<Leaderboard, Long> {
    List<Leaderboard> findByExamIdOrderByRankAsc(Long examId);
    List<Leaderboard> findByStudentId(Long studentId);
    Optional<Leaderboard> findByStudentIdAndExamId(Long studentId, Long examId);
}

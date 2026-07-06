package com.exampro.service;

import com.exampro.dto.LeaderboardResponse;
import com.exampro.entity.Exam;
import com.exampro.entity.Leaderboard;
import com.exampro.entity.User;
import com.exampro.exception.ResourceNotFoundException;
import com.exampro.repository.ExamRepository;
import com.exampro.repository.LeaderboardRepository;
import com.exampro.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;
    private final UserRepository userRepository;
    private final ExamRepository examRepository;

    public LeaderboardService(LeaderboardRepository leaderboardRepository,
                              UserRepository userRepository,
                              ExamRepository examRepository) {
        this.leaderboardRepository = leaderboardRepository;
        this.userRepository = userRepository;
        this.examRepository = examRepository;
    }

    public List<LeaderboardResponse> getLeaderboardByExamId(Long examId) {
        return leaderboardRepository.findByExamIdOrderByRankAsc(examId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<LeaderboardResponse> getAllLeaderboardEntries() {
        return leaderboardRepository.findAll().stream()
                .sorted((l1, l2) -> l2.getTopScore().compareTo(l1.getTopScore()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateLeaderboard(Long studentId, Long examId, Double score, Double percentage) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", studentId));
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam", "id", examId));

        Optional<Leaderboard> existingEntry = leaderboardRepository.findByStudentIdAndExamId(studentId, examId);

        if (existingEntry.isPresent()) {
            Leaderboard entry = existingEntry.get();
            if (score > entry.getTopScore()) {
                entry.setTopScore(score);
                entry.setPercentage(percentage);
                leaderboardRepository.save(entry);
            }
        } else {
            Leaderboard entry = new Leaderboard();
            entry.setStudent(student);
            entry.setExam(exam);
            entry.setTopScore(score);
            entry.setPercentage(percentage);
            entry.setRank(999); // Temporary high rank before recalculation
            leaderboardRepository.save(entry);
        }

        recalculateRanks(examId);
    }

    @Transactional
    public void recalculateRanks(Long examId) {
        // Load all entries for the exam sorted by top_score desc
        List<Leaderboard> entries = leaderboardRepository.findAll().stream()
                .filter(l -> l.getExam().getId().equals(examId))
                .sorted((l1, l2) -> l2.getTopScore().compareTo(l1.getTopScore()))
                .collect(Collectors.toList());

        for (int i = 0; i < entries.size(); i++) {
            entries.get(i).setRank(i + 1);
        }

        leaderboardRepository.saveAll(entries);
    }

    private LeaderboardResponse mapToResponse(Leaderboard leaderboard) {
        return new LeaderboardResponse(
                leaderboard.getId(),
                leaderboard.getStudent().getName(),
                leaderboard.getExam().getTitle(),
                leaderboard.getTopScore(),
                leaderboard.getPercentage(),
                leaderboard.getRank(),
                leaderboard.getUpdatedAt()
        );
    }
}

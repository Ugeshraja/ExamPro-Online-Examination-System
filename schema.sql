-- ExamPro Database Schema
CREATE DATABASE IF NOT EXISTS exampro_db;
USE exampro_db;

-- 1. Users Table (Stores both Admin and Student with role-based auth)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'ADMIN', 'STUDENT'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Exams Table
CREATE TABLE IF NOT EXISTS exams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL,
    passing_marks DOUBLE NOT NULL,
    total_questions INT NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    schedule_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    exam_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    marks DOUBLE NOT NULL DEFAULT 1.0,
    negative_marks DOUBLE NOT NULL DEFAULT 0.0,
    difficulty VARCHAR(20) NOT NULL, -- 'EASY', 'MEDIUM', 'HARD'
    category VARCHAR(50) NOT NULL,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 4. Options Table
CREATE TABLE IF NOT EXISTS options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- 5. Results Table
CREATE TABLE IF NOT EXISTS results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    exam_id BIGINT NOT NULL,
    score DOUBLE NOT NULL,
    percentage DOUBLE NOT NULL,
    correct_answers INT NOT NULL,
    wrong_answers INT NOT NULL,
    skipped_questions INT NOT NULL,
    time_taken_seconds INT NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'PASS', 'FAIL'
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 6. Leaderboard Table
CREATE TABLE IF NOT EXISTS leaderboard (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    exam_id BIGINT NOT NULL,
    top_score DOUBLE NOT NULL,
    percentage DOUBLE NOT NULL,
    `rank` INT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_exam (student_id, exam_id)
);

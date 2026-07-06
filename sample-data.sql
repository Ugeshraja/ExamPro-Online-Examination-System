-- ExamPro Seed Data
USE exampro_db;

-- Clear tables in order
DELETE FROM leaderboard;
DELETE FROM results;
DELETE FROM options;
DELETE FROM questions;
DELETE FROM exams;
DELETE FROM users;

-- 1. Insert Users (BCrypt hashes for 'admin123' and 'student123')
-- Hash: $2a$10$8.gKVS7C5LpWZ8fTxXzJfeXkC8WpM2o59LwQ/ZJepz.T0y7nryZKy
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'System Admin', 'admin@exampro.com', '$2a$10$8.gKVS7C5LpWZ8fTxXzJfeXkC8WpM2o59LwQ/ZJepz.T0y7nryZKy', 'ADMIN'),
(2, 'John Student', 'student@exampro.com', '$2a$10$8.gKVS7C5LpWZ8fTxXzJfeXkC8WpM2o59LwQ/ZJepz.T0y7nryZKy', 'STUDENT'),
(3, 'Jane Learner', 'jane@exampro.com', '$2a$10$8.gKVS7C5LpWZ8fTxXzJfeXkC8WpM2o59LwQ/ZJepz.T0y7nryZKy', 'STUDENT');

-- 2. Insert Exams
INSERT INTO exams (id, title, description, duration_minutes, passing_marks, total_questions, is_published, schedule_time) VALUES
(1, 'Java Fundamentals Certification', 'Test your knowledge on Core Java concepts including OOPs, Exceptions, Collections, and Multithreading.', 15, 60.0, 5, TRUE, NOW() - INTERVAL 1 HOUR),
(2, 'Spring Boot & Microservices Exam', 'Intermediate level exam covering Dependency Injection, Spring Boot starters, REST APIs, and JPA mappings.', 20, 60.0, 5, TRUE, NOW() + INTERVAL 2 HOUR),
(3, 'Web Development Basics', 'Introductory exam covering HTML5, CSS3 layout models, JavaScript ES6 arrays, and React components.', 10, 50.0, 5, FALSE, NOW() + INTERVAL 1 DAY);

-- 3. Insert Questions for Exam 1 (Java Fundamentals Certification)
INSERT INTO questions (id, exam_id, question_text, marks, negative_marks, difficulty, category) VALUES
(1, 1, 'Which of the following is NOT a feature of Java?', 20.0, 5.0, 'EASY', 'Core Java'),
(2, 1, 'What is the default value of an instance variable of type boolean in Java?', 20.0, 5.0, 'EASY', 'Core Java'),
(3, 1, 'Which Java collection class allows null elements and maintains insertion order?', 20.0, 5.0, 'MEDIUM', 'Collections'),
(4, 1, 'What is the purpose of the GC (Garbage Collector) in Java?', 20.0, 5.0, 'EASY', 'JVM'),
(5, 1, 'Which keyword is used to prevent method overriding in Java?', 20.0, 5.0, 'MEDIUM', 'OOPs');

-- 4. Insert Options for Exam 1 Questions
INSERT INTO options (id, question_id, option_text, is_correct) VALUES
-- Q1 options
(1, 1, 'Object-Oriented', FALSE),
(2, 1, 'Platform Independent', FALSE),
(3, 1, 'Pointers support', TRUE),
(4, 1, 'Robust and Secure', FALSE),
-- Q2 options
(5, 2, 'true', FALSE),
(6, 2, 'false', TRUE),
(7, 2, 'null', FALSE),
(8, 2, '0', FALSE),
-- Q3 options
(9, 3, 'HashMap', FALSE),
(10, 3, 'ArrayList', TRUE),
(11, 3, 'TreeSet', FALSE),
(12, 3, 'HashSet', FALSE),
-- Q4 options
(13, 4, 'To allocate memory to objects', FALSE),
(14, 4, 'To compile Java bytecode', FALSE),
(15, 4, 'To reclaim unused heap memory by destroying unreachable objects', TRUE),
(16, 4, 'To secure execution of threads', FALSE),
-- Q5 options
(17, 5, 'static', FALSE),
(18, 5, 'abstract', FALSE),
(19, 5, 'constant', FALSE),
(20, 5, 'final', TRUE);

-- 5. Insert Questions for Exam 2 (Spring Boot & Microservices)
INSERT INTO questions (id, exam_id, question_text, marks, negative_marks, difficulty, category) VALUES
(6, 2, 'Which annotation is used to mark a class as a Spring Boot configuration and auto-configuration source?', 20.0, 0.0, 'EASY', 'Spring Boot'),
(7, 2, 'Which of the following annotations is equivalent to @Controller and @ResponseBody combined?', 20.0, 0.0, 'EASY', 'Spring MVC'),
(8, 2, 'What is the purpose of @Autowired annotation in Spring?', 20.0, 0.0, 'EASY', 'Core Spring'),
(9, 2, 'Where does Spring Boot search for the application properties file by default?', 20.0, 0.0, 'MEDIUM', 'Spring Config'),
(10, 2, 'Which starter dependency is required to build a RESTful Web Service using Spring Boot?', 20.0, 0.0, 'EASY', 'Dependencies');

-- 6. Insert Options for Exam 2 Questions
INSERT INTO options (id, question_id, option_text, is_correct) VALUES
-- Q6 options
(21, 6, '@Configuration', FALSE),
(22, 6, '@SpringBootApplication', TRUE),
(23, 6, '@EnableAutoConfiguration', FALSE),
(24, 6, '@ComponentScan', FALSE),
-- Q7 options
(25, 7, '@RestController', TRUE),
(26, 7, '@Service', FALSE),
(27, 7, '@Repository', FALSE),
(28, 7, '@Component', FALSE),
-- Q8 options
(29, 8, 'To encrypt bean communications', FALSE),
(30, 8, 'To enforce database transaction rollback', FALSE),
(31, 8, 'To enable automatic dependency injection', TRUE),
(32, 8, 'To expose a bean as a REST service', FALSE),
-- Q9 options
(33, 9, 'src/main/java', FALSE),
(34, 9, 'src/main/resources', TRUE),
(35, 9, 'src/test/resources', FALSE),
(36, 9, 'target/classes', FALSE),
-- Q10 options
(37, 10, 'spring-boot-starter-data-jpa', FALSE),
(38, 10, 'spring-boot-starter-security', FALSE),
(39, 10, 'spring-boot-starter-web', TRUE),
(40, 10, 'spring-boot-starter-thymeleaf', FALSE);

-- 7. Insert Questions for Exam 3 (Web Development Basics)
INSERT INTO questions (id, exam_id, question_text, marks, negative_marks, difficulty, category) VALUES
(11, 3, 'Which HTML5 element represents the main content of a document?', 20.0, 0.0, 'EASY', 'HTML'),
(12, 3, 'What does CSS stand for?', 20.0, 0.0, 'EASY', 'CSS'),
(13, 3, 'Which ES6 method is used to create a new array with all elements that pass a test?', 20.0, 0.0, 'MEDIUM', 'JavaScript'),
(14, 3, 'What is the purpose of React state?', 20.0, 0.0, 'MEDIUM', 'React'),
(15, 3, 'Which hook is used to perform side effects in functional React components?', 20.0, 0.0, 'EASY', 'React');

-- 8. Insert Options for Exam 3 Questions
INSERT INTO options (id, question_id, option_text, is_correct) VALUES
-- Q11 options
(41, 11, '<section>', FALSE),
(42, 11, '<article>', FALSE),
(43, 11, '<main>', TRUE),
(44, 11, '<div>', FALSE),
-- Q12 options
(45, 12, 'Computer Style Sheets', FALSE),
(46, 12, 'Cascading Style Sheets', TRUE),
(47, 12, 'Creative Style Sheets', FALSE),
(48, 12, 'Colorful Style Sheets', FALSE),
-- Q13 options
(49, 13, 'map()', FALSE),
(50, 13, 'filter()', TRUE),
(51, 13, 'forEach()', FALSE),
(52, 13, 'reduce()', FALSE),
-- Q14 options
(53, 14, 'To store global configuration properties', FALSE),
(54, 14, 'To hold data that changes over time and triggers re-renders', TRUE),
(55, 14, 'To reference real DOM nodes directly', FALSE),
(56, 14, 'To style elements inline', FALSE),
-- Q15 options
(57, 15, 'useState', FALSE),
(58, 15, 'useContext', FALSE),
(59, 15, 'useEffect', TRUE),
(60, 15, 'useMemo', FALSE);

-- 9. Insert Sample Results
INSERT INTO results (id, student_id, exam_id, score, percentage, correct_answers, wrong_answers, skipped_questions, time_taken_seconds, status, submitted_at) VALUES
(1, 2, 1, 80.0, 80.0, 4, 1, 0, 480, 'PASS', NOW() - INTERVAL 2 HOUR),
(2, 3, 1, 60.0, 60.0, 3, 2, 0, 520, 'PASS', NOW() - INTERVAL 1 HOUR);

-- 10. Insert Leaderboard Entries
INSERT INTO leaderboard (id, student_id, exam_id, top_score, percentage, `rank`) VALUES
(1, 2, 1, 80.0, 80.0, 1),
(2, 3, 1, 60.0, 60.0, 2);

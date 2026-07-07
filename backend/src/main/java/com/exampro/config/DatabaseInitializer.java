package com.exampro.config;

import com.exampro.entity.Exam;
import com.exampro.entity.Option;
import com.exampro.entity.Question;
import com.exampro.entity.User;
import com.exampro.repository.ExamRepository;
import com.exampro.repository.QuestionRepository;
import com.exampro.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;

    public DatabaseInitializer(UserRepository userRepository,
                               ExamRepository examRepository,
                               QuestionRepository questionRepository) {
        this.userRepository = userRepository;
        this.examRepository = examRepository;
        this.questionRepository = questionRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Seed Users if database is empty
        if (userRepository.count() == 0) {
            System.out.println("No users found in database. Seeding default credentials...");
            
            // Password: 'admin123'
            String adminPasswordHash = "$2a$10$8.gKVS7C5LpWZ8fTxXzJfeXkC8WpM2o59LwQ/ZJepz.T0y7nryZKy";
            
            User admin = new User("System Admin", "admin@exampro.com", adminPasswordHash, "ADMIN");
            User student = new User("John Student", "student@exampro.com", adminPasswordHash, "STUDENT");
            User student2 = new User("Jane Learner", "jane@exampro.com", adminPasswordHash, "STUDENT");

            userRepository.saveAll(Arrays.asList(admin, student, student2));
            System.out.println("Default users successfully seeded.");
        }

        // 2. Seed Exams and Questions if empty
        if (examRepository.count() == 0) {
            System.out.println("No exams found in database. Seeding sample exams and MCQs...");

            // Exam 1: Java Fundamentals
            Exam javaExam = new Exam();
            javaExam.setTitle("Java Fundamentals Certification");
            javaExam.setDescription("Test your knowledge on Core Java concepts including OOPs, Exceptions, Collections, and Multithreading.");
            javaExam.setDurationMinutes(15);
            javaExam.setPassingMarks(60.0);
            javaExam.setTotalQuestions(5);
            javaExam.setIsPublished(true);
            javaExam.setScheduleTime(LocalDateTime.now().minusHours(1));
            Exam savedJavaExam = examRepository.save(javaExam);

            // Question 1
            Question q1 = new Question();
            q1.setExam(savedJavaExam);
            q1.setQuestionText("Which of the following is NOT a feature of Java?");
            q1.setMarks(20.0);
            q1.setNegativeMarks(5.0);
            q1.setDifficulty("EASY");
            q1.setCategory("Core Java");
            q1.addOption(new Option("Object-Oriented", false));
            q1.addOption(new Option("Platform Independent", false));
            q1.addOption(new Option("Pointers support", true));
            q1.addOption(new Option("Robust and Secure", false));
            questionRepository.save(q1);

            // Question 2
            Question q2 = new Question();
            q2.setExam(savedJavaExam);
            q2.setQuestionText("What is the default value of an instance variable of type boolean in Java?");
            q2.setMarks(20.0);
            q2.setNegativeMarks(5.0);
            q2.setDifficulty("EASY");
            q2.setCategory("Core Java");
            q2.addOption(new Option("true", false));
            q2.addOption(new Option("false", true));
            q2.addOption(new Option("null", false));
            q2.addOption(new Option("0", false));
            questionRepository.save(q2);

            // Question 3
            Question q3 = new Question();
            q3.setExam(savedJavaExam);
            q3.setQuestionText("Which Java collection class allows null elements and maintains insertion order?");
            q3.setMarks(20.0);
            q3.setNegativeMarks(5.0);
            q3.setDifficulty("MEDIUM");
            q3.setCategory("Collections");
            q3.addOption(new Option("HashMap", false));
            q3.addOption(new Option("ArrayList", true));
            q3.addOption(new Option("TreeSet", false));
            q3.addOption(new Option("HashSet", false));
            questionRepository.save(q3);

            // Question 4
            Question q4 = new Question();
            q4.setExam(savedJavaExam);
            q4.setQuestionText("What is the purpose of the GC (Garbage Collector) in Java?");
            q4.setMarks(20.0);
            q4.setNegativeMarks(5.0);
            q4.setDifficulty("EASY");
            q4.setCategory("JVM");
            q4.addOption(new Option("To allocate memory to objects", false));
            q4.addOption(new Option("To compile Java bytecode", false));
            q4.addOption(new Option("To reclaim unused heap memory by destroying unreachable objects", true));
            q4.addOption(new Option("To secure execution of threads", false));
            questionRepository.save(q4);

            // Question 5
            Question q5 = new Question();
            q5.setExam(savedJavaExam);
            q5.setQuestionText("Which keyword is used to prevent method overriding in Java?");
            q5.setMarks(20.0);
            q5.setNegativeMarks(5.0);
            q5.setDifficulty("MEDIUM");
            q5.setCategory("OOPs");
            q5.addOption(new Option("static", false));
            q5.addOption(new Option("abstract", false));
            q5.addOption(new Option("constant", false));
            q5.addOption(new Option("final", true));
            questionRepository.save(q5);

            System.out.println("Sample examinations and questions successfully seeded.");
        }
    }
}

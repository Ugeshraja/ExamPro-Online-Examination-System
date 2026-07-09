package com.exampro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/db-check")
    public ResponseEntity<Map<String, Object>> checkDatabase() {
        Map<String, Object> response = new HashMap<>();
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement()) {
            
            boolean isValid = connection.isValid(5);
            response.put("status", "UP");
            response.put("connection_valid", isValid);
            
            try (ResultSet resultSet = statement.executeQuery("SELECT 1")) {
                if (resultSet.next()) {
                    response.put("query_test", "SUCCESS (returned " + resultSet.getInt(1) + ")");
                }
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "DOWN");
            response.put("error_message", e.getMessage());
            response.put("error_class", e.getClass().getName());
            
            // Extract root cause
            Throwable rootCause = e;
            while (rootCause.getCause() != null) {
                rootCause = rootCause.getCause();
            }
            response.put("root_cause_message", rootCause.getMessage());
            response.put("root_cause_class", rootCause.getClass().getName());
            
            StringBuilder stackTrace = new StringBuilder();
            int count = 0;
            for (StackTraceElement element : e.getStackTrace()) {
                if (count++ > 8) break;
                stackTrace.append(element.toString()).append("\n");
            }
            response.put("stack_trace", stackTrace.toString());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/error-logs")
    public ResponseEntity<java.util.List<Map<String, Object>>> getErrorLogs() {
        return ResponseEntity.ok(com.exampro.exception.GlobalExceptionHandler.ERROR_LOGS);
    }
}

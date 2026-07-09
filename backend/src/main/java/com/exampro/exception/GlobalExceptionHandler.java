package com.exampro.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    public static final java.util.List<Map<String, Object>> ERROR_LOGS = 
            java.util.Collections.synchronizedList(new java.util.ArrayList<>());

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("message", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> handleBadRequestException(BadRequestException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("message", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("message", "An unexpected error occurred: " + ex.getMessage());

        // Log error in memory for diagnostic purposes
        try {
            Map<String, Object> logEntry = new HashMap<>();
            logEntry.put("timestamp", java.time.LocalDateTime.now().toString());
            logEntry.put("message", ex.getMessage());
            logEntry.put("class", ex.getClass().getName());
            
            Throwable cause = ex;
            while (cause.getCause() != null) {
                cause = cause.getCause();
            }
            logEntry.put("root_cause_message", cause.getMessage());
            logEntry.put("root_cause_class", cause.getClass().getName());

            StringBuilder stackTrace = new StringBuilder();
            int count = 0;
            for (StackTraceElement element : ex.getStackTrace()) {
                if (count++ > 15) break;
                stackTrace.append(element.toString()).append("\n");
            }
            logEntry.put("stack_trace", stackTrace.toString());
            
            ERROR_LOGS.add(0, logEntry);
            while (ERROR_LOGS.size() > 20) {
                ERROR_LOGS.remove(ERROR_LOGS.size() - 1);
            }
        } catch (Exception ignored) {}

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

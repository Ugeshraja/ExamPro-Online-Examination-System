package com.exampro.controller;

import com.exampro.dto.RegisterRequest;
import com.exampro.entity.User;
import com.exampro.security.UserPrincipal;
import com.exampro.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        User user = userService.getUserById(currentUser.getId());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserPrincipal currentUser, @RequestBody RegisterRequest updateRequest) {
        // Enforce that the student updates their own profile
        User user = userService.updateUser(currentUser.getId(), updateRequest);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllStudents() {
        return ResponseEntity.ok(userService.getStudentsOnly());
    }

    @GetMapping("/students/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> searchStudents(@RequestParam("q") String query) {
        return ResponseEntity.ok(userService.searchStudents(query));
    }

    @GetMapping("/students/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping("/students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createStudent(@RequestBody RegisterRequest createRequest) {
        createRequest.setRole("STUDENT");
        User user = userService.registerUser(createRequest);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/students/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody RegisterRequest updateRequest) {
        User user = userService.updateUser(id, updateRequest);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/students/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        userService.deleteUser(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Student deleted successfully");
        return ResponseEntity.ok(response);
    }
}

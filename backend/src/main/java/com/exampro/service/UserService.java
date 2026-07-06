package com.exampro.service;

import com.exampro.dto.RegisterRequest;
import com.exampro.entity.User;
import com.exampro.exception.BadRequestException;
import com.exampro.exception.ResourceNotFoundException;
import com.exampro.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getStudentsOnly() {
        return userRepository.findByRole("STUDENT");
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @Transactional
    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email Address already in use!");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        
        // Default role is STUDENT if not specified or invalid
        String role = registerRequest.getRole();
        if (role == null || (!role.equals("ADMIN") && !role.equals("STUDENT"))) {
            role = "STUDENT";
        }
        user.setRole(role);

        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, RegisterRequest updateRequest) {
        User user = getUserById(id);
        
        user.setName(updateRequest.getName());
        user.setEmail(updateRequest.getEmail());
        
        if (updateRequest.getPassword() != null && !updateRequest.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        }

        if (updateRequest.getRole() != null) {
            user.setRole(updateRequest.getRole());
        }

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    public List<User> searchStudents(String query) {
        return userRepository.findByRole("STUDENT").stream()
                .filter(u -> u.getName().toLowerCase().contains(query.toLowerCase()) || 
                             u.getEmail().toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
    }

    public long countStudents() {
        return userRepository.countByRole("STUDENT");
    }
}

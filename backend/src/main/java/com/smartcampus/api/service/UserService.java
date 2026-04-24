package com.smartcampus.api.service;

import com.smartcampus.api.entity.User;
import com.smartcampus.api.entity.UserRole;
import com.smartcampus.api.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@AllArgsConstructor
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> findByGoogleId(String googleId) {
        return userRepository.findByGoogleId(googleId);
    }
    
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    /**
     * Register a new user with email and password
     */
    public User registerUser(String email, String firstName, String lastName, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }
        
        User newUser = User.builder()
            .email(email)
            .firstName(firstName)
            .lastName(lastName)
            .password(passwordEncoder.encode(password))
            .role(UserRole.STUDENT) // Default role
            .active(true)
            .build();
        
        return userRepository.save(newUser);
    }
    
    /**
     * Authenticate user with email and password
     */
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        if (!user.getActive()) {
            throw new RuntimeException("User account is deactivated");
        }
        
        return user;
    }
    
    /**
     * Create or update user from Google OAuth
     */
    public User createOrUpdateUser(String email, String firstName, String lastName, 
                                   String googleId, String profilePictureUrl) {
        return userRepository.findByGoogleId(googleId)
            .map(user -> {
                user.setEmail(email);
                user.setFirstName(firstName);
                user.setLastName(lastName);
                user.setProfilePictureUrl(profilePictureUrl);
                return userRepository.save(user);
            })
            .orElseGet(() -> {
                User newUser = User.builder()
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .googleId(googleId)
                    .profilePictureUrl(profilePictureUrl)
                    .role(UserRole.STUDENT) // Default role
                    .active(true)
                    .build();
                return userRepository.save(newUser);
            });
    }
    
    /**
     * Update user role (admin only)
     */
    public User updateUserRole(Long userId, UserRole newRole) {
        User user = findById(userId);
        user.setRole(newRole);
        return userRepository.save(user);
    }
    
    /**
     * Deactivate a user
     */
    public void deactivateUser(Long userId) {
        User user = findById(userId);
        user.setActive(false);
        userRepository.save(user);
    }
    
    /**
     * Activate a user
     */
    public void activateUser(Long userId) {
        User user = findById(userId);
        user.setActive(true);
        userRepository.save(user);
    }
}

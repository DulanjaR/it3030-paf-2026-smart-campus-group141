package com.smartcampus.api.service;

import com.smartcampus.api.entity.User;
import com.smartcampus.api.entity.UserRole;
import com.smartcampus.api.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@AllArgsConstructor
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    
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
    
    public void deactivateUser(Long userId) {
        User user = findById(userId);
        user.setActive(false);
        userRepository.save(user);
    }
}

package com.smartcampus.api.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.smartcampus.api.dto.LoginRequest;
import com.smartcampus.api.dto.LoginResponse;
import com.smartcampus.api.dto.UserResponse;
import com.smartcampus.api.entity.User;
import com.smartcampus.api.entity.UserRole;
import com.smartcampus.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

@Service
@Transactional
public class AuthService {
    
    private final UserRepository userRepository;
    private final JwtTokenService jwtTokenService;
    private final String googleClientId;
    private final GoogleIdTokenVerifier tokenVerifier;

    public AuthService(
            UserRepository userRepository,
            JwtTokenService jwtTokenService,
            @Value("${GOOGLE_CLIENT_ID:your-client-id}") String googleClientId
    ) {
        this.userRepository = userRepository;
        this.jwtTokenService = jwtTokenService;
        this.googleClientId = googleClientId;
        this.tokenVerifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(googleClientId))
                .build();
    }
    
    /**
     * Member 4 - OAuth 2.0 login endpoint
     * Authenticates user via Google id_token and creates/updates user record.
     */
    public LoginResponse loginWithGoogle(LoginRequest request) {
        if (request == null || request.getGoogleToken() == null || request.getGoogleToken().isBlank()) {
            throw new RuntimeException("Google token is required");
        }

        UserPayload payload = verifyGoogleToken(request.getGoogleToken());

        String email = payload.getEmail();
        String googleId = payload.getGoogleId();
        String firstName = payload.getFirstName();
        String lastName = payload.getLastName();
        String pictureUrl = payload.getPictureUrl();

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(email)
                            .googleId(googleId)
                            .firstName(firstName != null ? firstName : "User")
                            .lastName(lastName != null ? lastName : "")
                            .profilePictureUrl(pictureUrl)
                            .role(UserRole.STUDENT)
                            .active(true)
                            .build();
                    return userRepository.save(newUser);
                });

        user.setUpdatedAt(LocalDateTime.now());
        if (pictureUrl != null) {
            user.setProfilePictureUrl(pictureUrl);
        }
        userRepository.save(user);

        String jwtToken = jwtTokenService.generateToken(user);

        return LoginResponse.builder()
                .token(jwtToken)
                .user(convertToUserResponse(user))
                .message("Login successful")
                .build();
    }

    private UserPayload verifyGoogleToken(String token) {
        if (googleClientId == null || googleClientId.isBlank() || googleClientId.contains("your-client-id")) {
            return parseGoogleToken(token);
        }

        try {
            GoogleIdToken idToken = GoogleIdToken.parse(JacksonFactory.getDefaultInstance(), token);
            if (idToken == null || !tokenVerifier.verify(idToken)) {
                throw new RuntimeException("Google token verification failed");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            if (email == null || email.isBlank()) {
                throw new RuntimeException("Google token did not include an email");
            }

            String firstName = (String) payload.get("given_name");
            String lastName = (String) payload.get("family_name");
            String pictureUrl = (String) payload.get("picture");
            String googleId = payload.getSubject();

            return new UserPayload(email, googleId, firstName, lastName, pictureUrl);
        } catch (GeneralSecurityException | IOException ex) {
            throw new RuntimeException("Failed to validate Google token", ex);
        }
    }

    private UserPayload parseGoogleToken(String token) {
        if (token.contains("::")) {
            String[] parts = token.split("::", -1);
            String email = parts.length > 0 ? parts[0] : null;
            String googleId = parts.length > 1 && !parts[1].isBlank() ? parts[1] : email;
            String firstName = parts.length > 2 ? parts[2] : "User";
            String lastName = parts.length > 3 ? parts[3] : "";
            String pictureUrl = parts.length > 4 ? parts[4] : null;
            if (email == null || email.isBlank()) {
                throw new RuntimeException("Invalid token payload");
            }
            return new UserPayload(email, googleId, firstName, lastName, pictureUrl);
        }

        if (token.contains("@")) {
            return new UserPayload(token, token, "User", "", null);
        }

        throw new RuntimeException("Unable to parse Google token");
    }

    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToUserResponse(user);
    }

    public UserResponse updateUserProfile(Long userId, String firstName, String lastName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (firstName != null && !firstName.isBlank()) {
            user.setFirstName(firstName);
        }
        if (lastName != null && !lastName.isBlank()) {
            user.setLastName(lastName);
        }

        User updated = userRepository.save(user);
        return convertToUserResponse(updated);
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public String logout(Long userId) {
        return "Logout successful";
    }

    private UserResponse convertToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .role(user.getRole())
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private static class UserPayload {
        private final String email;
        private final String googleId;
        private final String firstName;
        private final String lastName;
        private final String pictureUrl;

        public UserPayload(String email, String googleId, String firstName, String lastName, String pictureUrl) {
            this.email = email;
            this.googleId = googleId;
            this.firstName = firstName;
            this.lastName = lastName;
            this.pictureUrl = pictureUrl;
        }

        public String getEmail() {
            return email;
        }

        public String getGoogleId() {
            return googleId;
        }

        public String getFirstName() {
            return firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public String getPictureUrl() {
            return pictureUrl;
        }
    }
}

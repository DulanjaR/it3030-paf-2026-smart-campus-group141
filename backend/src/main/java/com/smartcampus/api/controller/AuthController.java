package com.smartcampus.api.controller;

import com.smartcampus.api.entity.User;
import com.smartcampus.api.service.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final String GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

    private final UserService userService;
    private final RestTemplate restTemplate = new RestTemplate();

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request == null || request.token() == null || request.token().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Google access token is required"));
        }

        try {
            GoogleProfile profile = fetchGoogleProfile(request.token());
            User user = userService.createOrUpdateUser(
                    profile.email(),
                    profile.firstName(),
                    profile.lastName(),
                    profile.googleId(),
                    profile.profilePictureUrl()
            );

            return ResponseEntity.ok(new AuthResponse(request.token(), UserProfile.from(user)));
        } catch (HttpClientErrorException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Google sign-in token is invalid or expired"));
        } catch (RestClientException ex) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("message", "Could not verify Google sign-in right now"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        String token = extractBearerToken(authorization);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Missing bearer token"));
        }

        try {
            GoogleProfile profile = fetchGoogleProfile(token);
            User user = userService.findByGoogleId(profile.googleId())
                    .orElseGet(() -> userService.createOrUpdateUser(
                            profile.email(),
                            profile.firstName(),
                            profile.lastName(),
                            profile.googleId(),
                            profile.profilePictureUrl()
                    ));
            return ResponseEntity.ok(UserProfile.from(user));
        } catch (HttpClientErrorException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Google sign-in token is invalid or expired"));
        } catch (RestClientException ex) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("message", "Could not verify Google sign-in right now"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        String token = extractBearerToken(authorization);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Missing bearer token"));
        }

        return ResponseEntity.ok(Map.of("token", token));
    }

    private GoogleProfile fetchGoogleProfile(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        org.springframework.http.HttpEntity<Void> entity = new org.springframework.http.HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                GOOGLE_USERINFO_URL,
                org.springframework.http.HttpMethod.GET,
                entity,
                Map.class
        );

        Map<?, ?> body = response.getBody();
        if (body == null || body.get("sub") == null || body.get("email") == null) {
            throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED, "Google profile is incomplete");
        }

        String email = value(body, "email");
        String fullName = value(body, "name");
        String firstName = value(body, "given_name");
        String lastName = value(body, "family_name");

        if (firstName.isBlank()) {
            firstName = !fullName.isBlank() ? fullName : email.substring(0, email.indexOf('@'));
        }

        return new GoogleProfile(
                value(body, "sub"),
                email,
                firstName,
                lastName,
                value(body, "picture")
        );
    }

    private String extractBearerToken(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return null;
        }
        return authorization.substring("Bearer ".length()).trim();
    }

    private String value(Map<?, ?> body, String key) {
        Object value = body.get(key);
        return value == null ? "" : value.toString();
    }

    private record LoginRequest(String token) {
    }

    private record AuthResponse(String token, UserProfile user) {
    }

    private record UserProfile(
            Long id,
            String email,
            String firstName,
            String lastName,
            String profilePictureUrl,
            String role
    ) {
        static UserProfile from(User user) {
            return new UserProfile(
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getProfilePictureUrl(),
                    user.getRole().name()
            );
        }
    }

    private record GoogleProfile(
            String googleId,
            String email,
            String firstName,
            String lastName,
            String profilePictureUrl
    ) {
    }
}

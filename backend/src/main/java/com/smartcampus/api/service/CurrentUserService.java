package com.smartcampus.api.service;

import com.smartcampus.api.entity.User;
import com.smartcampus.api.entity.UserRole;
import com.smartcampus.api.exception.ApiException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class CurrentUserService {

    private static final String GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

    private final UserService userService;
    private final RestTemplate restTemplate = new RestTemplate();

    public CurrentUserService(UserService userService) {
        this.userService = userService;
    }

    public User getCurrentUser(String authorizationHeader) {
        String token = extractBearerToken(authorizationHeader);
        if (token == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Please sign in before using bookings.");
        }

        GoogleProfile profile = fetchGoogleProfile(token);
        return userService.createOrUpdateUser(
                profile.email(),
                profile.firstName(),
                profile.lastName(),
                profile.googleId(),
                profile.profilePictureUrl()
        );
    }

    public boolean isAdmin(User user) {
        return user.getRole() == UserRole.ADMIN;
    }

    public void requireAdmin(User user) {
        if (!isAdmin(user)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only an admin can perform this action.");
        }
    }

    private GoogleProfile fetchGoogleProfile(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    GOOGLE_USERINFO_URL,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    Map.class
            );

            Map<?, ?> body = response.getBody();
            if (body == null || body.get("sub") == null || body.get("email") == null) {
                throw new ApiException(HttpStatus.UNAUTHORIZED, "Google profile is incomplete.");
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
        } catch (HttpClientErrorException ex) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Your Google sign-in has expired. Please log in again.");
        } catch (RestClientException ex) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Could not verify your Google sign-in right now.");
        }
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }

    private String value(Map<?, ?> body, String key) {
        Object value = body.get(key);
        return value == null ? "" : value.toString();
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

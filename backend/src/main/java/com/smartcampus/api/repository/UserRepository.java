package com.smartcampus.api.repository;

import com.smartcampus.api.entity.User;
import com.smartcampus.api.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
    Boolean existsByEmail(String email);
    
    // Member 4 - Additional methods for role management
    List<User> findByRole(UserRole role);
    List<User> findByActive(Boolean active);
}

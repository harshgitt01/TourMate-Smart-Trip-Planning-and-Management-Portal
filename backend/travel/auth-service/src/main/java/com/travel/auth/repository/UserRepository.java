package com.travel.auth.repository;

import com.travel.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Existing method
    Optional<User> findByEmail(String email);

    // --- ADD THIS NEW METHOD ---
    // Spring Data JPA will automatically generate the SQL to find a user 
    // where the 'resetToken' column matches.
    Optional<User> findByResetToken(String resetToken);
}
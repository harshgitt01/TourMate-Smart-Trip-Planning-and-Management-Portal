package com.travel.auth.service;

import com.travel.auth.dto.AuthRequest;
import com.travel.auth.dto.AuthResponse;
import com.travel.auth.dto.RegisterRequest;
import com.travel.auth.entity.Role;
import com.travel.auth.entity.User;
import com.travel.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime; // Import for expiry time
import java.util.UUID;        // Import for random token generation

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService; // NEW: Inject EmailService

    /**
     * Registers a new user, saves them to the DB, and returns a JWT token.
     */
    public AuthResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email().trim())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role() != null ? request.role() : Role.CUSTOMER)
                .build();
        
        repository.save(user);
        
        var jwtToken = jwtService.generateToken(user);
        
        return new AuthResponse(jwtToken, "User registered successfully");
    }

    /**
     * Authenticates an existing user and returns a JWT token.
     */
    public AuthResponse login(AuthRequest request) {
        String cleanEmail = request.email().trim();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        cleanEmail,
                        request.password()
                )
        );
        
        var user = repository.findByEmail(cleanEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        var jwtToken = jwtService.generateToken(user);
        
        return new AuthResponse(jwtToken, "Login successful");
    }

    // --- NEW: FORGOT PASSWORD LOGIC ---

    /**
     * Generates a reset token and sends it via email.
     */
    public void forgotPassword(String email) {
        User user = repository.findByEmail(email.trim())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // 1. Generate a unique random token
        String token = UUID.randomUUID().toString();

        // 2. Save it to the database with a 15-minute expiry
        user.setResetToken(token);
        user.setTokenExpiry(LocalDateTime.now().plusMinutes(15));
        repository.save(user);

        // 3. Send the email
        emailService.sendResetEmail(user.getEmail(), token);
    }

    /**
     * Verifies the token and updates the user's password.
     */
    public void resetPassword(String token, String newPassword) {
        // 1. Find user by token
        User user = repository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or missing token"));

        // 2. Check if token is expired
        if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        // 3. Update the password (remember to encode it!)
        user.setPassword(passwordEncoder.encode(newPassword));

        // 4. Clear the token so it can't be used again
        user.setResetToken(null);
        user.setTokenExpiry(null);

        repository.save(user);
    }
}
package com.travel.auth.controller;

import com.travel.auth.dto.AuthRequest;
import com.travel.auth.dto.AuthResponse;
import com.travel.auth.dto.RegisterRequest;
import com.travel.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map; // Added this import for handling JSON input

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint: POST /api/auth/register
     * Description: Creates a new user (Admin or Customer) and returns a JWT token.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    /**
     * Endpoint: POST /api/auth/login
     * Description: Authenticates existing credentials and returns a JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * Endpoint: POST /api/auth/logout
     * Description: Client-side logout helper.
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // In a stateless system, we just tell the client "OK"
        // The client is responsible for deleting the token.
        return ResponseEntity.ok("Logged out successfully");
    }

    // --- NEW: FORGOT PASSWORD FEATURES ---

    /**
     * Endpoint: POST /api/auth/forgot-password
     * Description: Generates a reset token and sends it to the user's email.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        authService.forgotPassword(email);
        return ResponseEntity.ok("If that email exists, a reset link has been sent.");
    }

    /**
     * Endpoint: POST /api/auth/reset-password
     * Description: Verifies the token and updates the password.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        authService.resetPassword(token, newPassword);

        return ResponseEntity.ok("Password reset successfully. You can now login.");
    }
}
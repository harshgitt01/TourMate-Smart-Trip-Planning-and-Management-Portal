package com.travel.auth.dto;

/**
 * Data Transfer Object for Authentication Responses.
 * This is what the frontend receives after logging in.
 */
public record AuthResponse(
    String accessToken,
    String message
) {}
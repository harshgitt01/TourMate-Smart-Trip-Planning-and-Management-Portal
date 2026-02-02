package com.travel.auth.dto;

/**
 * Data Transfer Object for Login Requests.
 * Since we are using Java 21, we use a 'record' which automatically 
 * handles getters, toString, equals, and hashCode.
 */
public record AuthRequest(
    String email,
    String password
) {}
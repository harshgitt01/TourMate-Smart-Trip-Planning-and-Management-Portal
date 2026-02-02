package com.travel.auth.dto;

import com.travel.auth.entity.Role;

/**
 * Data Transfer Object for Registration.
 * 'role' is optional in the JSON. If null, the service defaults it to CUSTOMER.
 */
public record RegisterRequest(
    String firstName,
    String lastName,
    String email,
    String password,
    Role role
) {}
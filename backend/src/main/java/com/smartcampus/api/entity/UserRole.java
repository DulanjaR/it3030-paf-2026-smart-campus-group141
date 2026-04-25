package com.smartcampus.api.entity;

/**
 * Member 4 - User roles for Smart Campus application
 * Used for role-based access control
 */
public enum UserRole {
    STUDENT,     // Standard campus user
    USER,        // Regular user - can create bookings and tickets
    TECHNICIAN,  // Can be assigned to tickets for maintenance
    ADMIN        // Full access to all administrative functions
}

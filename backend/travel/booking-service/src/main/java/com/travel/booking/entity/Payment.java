package com.travel.booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;
    private String paymentMethod; // CREDIT_CARD, PAYPAL
    private boolean isSuccessful;
    private LocalDateTime paymentDate;

    /**
     * Links Payment to a specific Booking.
     * This creates a 'booking_id' foreign key column in the payments table.
     */
    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @PrePersist
    public void prePersist() {
        this.paymentDate = LocalDateTime.now();
        this.isSuccessful = true; // Default to true for this demo
    }
}
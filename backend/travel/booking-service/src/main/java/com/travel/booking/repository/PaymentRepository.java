package com.travel.booking.repository;

import com.travel.booking.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    // REQUIRED: Used by getPaymentByBookingId() in your service
    Optional<Payment> findByBookingId(Long bookingId);
}
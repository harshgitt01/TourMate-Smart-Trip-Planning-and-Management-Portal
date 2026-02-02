package com.travel.booking.service;

import com.travel.booking.entity.Booking;
import com.travel.booking.entity.Payment;
import com.travel.booking.repository.BookingRepository;
import com.travel.booking.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Transactional // Ensures both Payment save and Booking update happen together
    public Payment processPayment(Payment payment) {
        // 1. We must fetch the actual Booking entity from the DB to link it correctly
        Long bookingId = payment.getBooking().getId();
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Cannot pay for non-existent booking ID: " + bookingId));

        // 2. Link the payment to the booking
        payment.setBooking(booking);
        
        // 3. Save the payment
        Payment savedPayment = paymentRepository.save(payment);

        // 4. Automatically update the Booking status to CONFIRMED
        booking.setStatus("CONFIRMED");
        bookingRepository.save(booking);

        return savedPayment;
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    public Payment getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("No payment found for booking ID: " + bookingId));
    }
}
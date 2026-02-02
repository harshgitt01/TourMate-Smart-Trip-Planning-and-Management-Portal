package com.travel.booking.controller;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.travel.booking.entity.Payment;
import com.travel.booking.service.PaymentService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Allow Frontend access
public class PaymentController {

    private final PaymentService service;

    // 🔒 SECURE: Reads the key from your Environment Variables (set in IDE or .env)
    @Value("${stripe.api.key}")
    private String stripeApiKey;

    // Initialize Stripe when the application starts
    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    /**
     * NEW: Generate a Stripe Payment Intent.
     * The Frontend calls this to get a "Client Secret" to allow the user to pay.
     * URL: POST http://localhost:8083/api/payments/create-intent
     */
    @PostMapping("/create-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody Map<String, Object> data) {
        try {
            // Stripe expects amount in "paisa" (smallest currency unit).
            // Example: ₹500.00 -> 50000L
            Double amount = Double.parseDouble(data.get("amount").toString());

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount.longValue() * 100) // Convert to cents/paisa
                    .setCurrency("inr") // Change currency if needed (usd, eur, etc.)
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
                    )
                    .build();

            // Create the intent on Stripe's servers
            PaymentIntent intent = PaymentIntent.create(params);

            // Send the "Client Secret" back to React
            Map<String, String> response = new HashMap<>();
            response.put("clientSecret", intent.getClientSecret());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * (Optional) Keep your old method if you want to save a record AFTER payment succeeds.
     * You might call this from the frontend after the Stripe flow finishes.
     */
    @PostMapping
    public ResponseEntity<Payment> processPayment(@RequestBody Payment payment) {
        return ResponseEntity.ok(service.processPayment(payment));
    }

    /**
     * Get payment details by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPaymentById(id));
    }

    /**
     * Get payment details for a specific Booking ID.
     */
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Payment> getPaymentByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(service.getPaymentByBookingId(bookingId));
    }
}
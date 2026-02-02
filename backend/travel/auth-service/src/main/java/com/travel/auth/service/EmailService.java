package com.travel.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetEmail(String to, String token) {
        
        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("TripSync Password Reset Request");
        message.setText("To reset your password, click the link below:\n\n" + resetLink);

        try {
            mailSender.send(message);
            System.out.println("Mail sent to " + to);
        } catch (Exception e) {
            
            System.err.println("FAILED TO SEND EMAIL. HERE IS THE LINK:");
            System.out.println(resetLink);
        }
    }
}
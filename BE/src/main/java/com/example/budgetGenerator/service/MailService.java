package com.example.budgetGenerator.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class MailService {
    private final JavaMailSender mailSender;

    // Constructor
    public MailService(JavaMailSender sender) {
        this.mailSender = sender;
    }

    public void sendBudgetReceipt(String userEmail, String budgetResponse) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String body = String.format(
            "Dear %s,<br><br>" +
            "I hope this email finds you well. Attached is your yearly budget breakdown based on the details you provided.<br>" +
            "%s<br><br>" +
            "If you have any questions, feel free to reach out. We're here to help you stay on top of your finances!<br><br>" +
            "Best regards,<br>" +
            "<strong>Budget Bozos</strong><br>" +
            "SENG 401 L02 Group 10<br>",
            userEmail, budgetResponse
        );

        // Set email parameters
        helper.setFrom("acmeplex2@gmail.com");
        helper.setTo(userEmail);
        helper.setSubject("Budget Receipt");
        helper.setText(convertMarkdownToHtml(body), true);

        mailSender.send(message);
    }

    // Converts AI response to HTML from Markdown
    private String convertMarkdownToHtml(String markdown) {
        return markdown
            .replaceAll("## (.*?)\\n", "<h2>$1</h2>") // Convert headers
            .replaceAll("\\*\\*(.*?)\\*\\*", "<strong>$1</strong>") // Bold text
            .replaceAll("\\* (.*?)\\n", "<li>$1</li>") // List items
            .replaceAll("\\n\\n", "<br><br>") // Preserve line breaks
            .replaceAll("(?<=</li>)<br><br>", "") // Remove extra breaks after lists
            .replaceAll("<li>(.*?)</li>", "<ul><li>$1</li></ul>"); // Wrap in <ul>
    }
}

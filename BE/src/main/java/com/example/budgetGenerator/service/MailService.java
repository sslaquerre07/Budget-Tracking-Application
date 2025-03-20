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

    //Sends budget receipt to the user
    public void sendBudgetReceipt(String userEmail, String budgetResponse) throws MessagingException {
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

        sendEmail(userEmail, "Budget Receipt", body);
    }

    //Sets password update email to the user
    public void sendPasswordUpdate(String userEmail) throws MessagingException{
        String emailBody = String.format(
            "Hello %s,\n\n" +
            "We wanted to let you know that your password was successfully updated.\n\n" +
            "If you did not make this change, please reset your password immediately or contact our support team.\n\n" +
            "Best regards,<br>" +
            "<strong>Budget Bozos</strong><br>" +
            "SENG 401 L02 Group 10<br>",
            userEmail
        );

        sendEmail(userEmail, "Password update", emailBody);
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

    //Sets the basic params of an email and send it:
    private void sendEmail(String recepient, String subject, String content) throws MessagingException{
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // Set email parameters
        helper.setFrom("acmeplex2@gmail.com");
        helper.setTo(recepient);
        helper.setSubject("Budget Receipt");
        helper.setText(convertMarkdownToHtml(content), true);

        mailSender.send(message);
    }

}

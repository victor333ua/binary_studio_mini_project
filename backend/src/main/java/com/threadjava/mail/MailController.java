package com.threadjava.mail;

import com.threadjava.mail.dto.SimpleMessageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
public class MailController {
    @Autowired EmailService emailService;

    @PostMapping
    void sharePost(@RequestBody SimpleMessageDto message) {
        emailService.sendSimpleMessage(
                message.getFrom(), message.getTo(), message.getSubject(), message.getText());
    }

}

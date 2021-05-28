package com.threadjava.mail;

public interface EmailService {
    public void sendSimpleMessage(String from, String to, String subject, String text);
}

package com.threadjava.mail.dto;

import lombok.Data;

@Data
public class SimpleMessageDto {
    private String from;
    private String to;
    private String subject;
    private String text;
}

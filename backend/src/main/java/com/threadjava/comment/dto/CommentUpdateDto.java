package com.threadjava.comment.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class CommentUpdateDto {
    private UUID id;
    private String body;
}

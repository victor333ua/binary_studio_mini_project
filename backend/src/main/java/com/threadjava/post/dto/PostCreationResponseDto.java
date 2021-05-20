package com.threadjava.post.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class PostCreationResponseDto {
    private UUID postId;
    private UUID userId;
}

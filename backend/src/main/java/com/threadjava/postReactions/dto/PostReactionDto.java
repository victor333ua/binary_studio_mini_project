package com.threadjava.postReactions.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class PostReactionDto {
    private UUID postId;
    private UUID postOwnerId;
    private Boolean isLike;
    private UUID userId;
}

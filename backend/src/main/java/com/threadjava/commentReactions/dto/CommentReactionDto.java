package com.threadjava.commentReactions.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class CommentReactionDto {
    private UUID commentId;
    private Boolean isLike;
    private UUID userId;
}

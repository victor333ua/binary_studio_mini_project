package com.threadjava.commentReactions.dto;

import com.threadjava.users.dto.UserShortDto;
import lombok.Data;

import java.util.UUID;

@Data
public class CommentReactionCreationDto {
    private UUID commentId;
    private UUID postId;
    private Boolean isLike;
    private UserShortDto currentUser;
    private Boolean isNewRecord;
}

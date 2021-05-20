package com.threadjava.postReactions.dto;

import com.threadjava.users.dto.UserShortDto;
import lombok.Data;
import java.util.UUID;

@Data
public class PostReactionCreationDto {
    private UUID postId;
    private UUID postOwnerId;
    private Boolean isLike;
    private UserShortDto currentUser;
    private Boolean isNewRecord;
}

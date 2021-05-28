package com.threadjava.postReactions.dto;

import com.threadjava.users.dto.UserDetailsDto;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Data
public class PostReactionCreationDto {
    private UUID postId;
    private Date createdAt;
    private UserDetailsDto postOwner;
    private Boolean isLike;
    private UserDetailsDto currentUser;
    private Boolean isNewRecord;
}

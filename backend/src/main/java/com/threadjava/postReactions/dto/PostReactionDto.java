package com.threadjava.postReactions.dto;

import com.threadjava.users.dto.UserDetailsDto;
import lombok.Data;
import java.util.UUID;

@Data
public class PostReactionDto {
    private UserDetailsDto user;
    private Boolean isLike;
}

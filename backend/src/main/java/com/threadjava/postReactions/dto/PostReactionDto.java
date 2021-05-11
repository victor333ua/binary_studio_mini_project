package com.threadjava.postReactions.dto;

import com.threadjava.users.dto.UserShortDto;
import lombok.Data;
import java.util.UUID;

@Data
public class PostReactionDto {
    private UserShortDto user;
    private Boolean isLike;
}

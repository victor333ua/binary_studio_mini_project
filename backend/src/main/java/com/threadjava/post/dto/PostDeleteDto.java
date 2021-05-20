package com.threadjava.post.dto;

import com.threadjava.users.dto.UserShortDto;
import lombok.Data;

import java.util.UUID;

@Data
public class PostDeleteDto {
    private UUID id;
    private UserShortDto currentUser;
}

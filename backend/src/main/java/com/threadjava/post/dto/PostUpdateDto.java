package com.threadjava.post.dto;

import com.threadjava.image.dto.ImageDto;
import com.threadjava.users.dto.UserDetailsDto;
import lombok.Data;

import java.util.Date;
import java.util.UUID;
@Data

public class PostUpdateDto {
    private UUID id;
    private String body;
    private ImageDto image;
    private UserDetailsDto currentUser;
}

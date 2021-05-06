package com.threadjava.post.dto;

import com.threadjava.image.dto.ImageDto;
import com.threadjava.users.dto.UserShortDto;
import lombok.Data;
import java.util.Date;
import java.util.UUID;

@Data
public class PostListDto {
    private UUID id;
    private String body;
    private long likeCount;
    private long dislikeCount;
    private long commentCount;
    private Date createdAt;
    private ImageDto image;
    private UserShortDto user;
}

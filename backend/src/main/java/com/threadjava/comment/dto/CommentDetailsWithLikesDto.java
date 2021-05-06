package com.threadjava.comment.dto;

import com.threadjava.users.dto.UserShortDto;;
import lombok.Data;

import java.util.Date;
import java.util.UUID;
@Data
public class CommentDetailsWithLikesDto {
    private UUID id;
    private String body;
    private UserShortDto user;
    private Date createdAt;
    private long likeCount;
    private long dislikeCount;
}

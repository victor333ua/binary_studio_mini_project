package com.threadjava.comment.dto;

import com.threadjava.commentReactions.dto.CommentReactionDto;
import com.threadjava.users.dto.UserShortDto;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
public class CommentDetailsDto {
    private UUID id;
    private String body;
    private UserShortDto user;
    private Date createdAt;
    private long likeCount;
    private long dislikeCount;
    private List<CommentReactionDto> reactions = new ArrayList<>();
    private UUID postId;
}

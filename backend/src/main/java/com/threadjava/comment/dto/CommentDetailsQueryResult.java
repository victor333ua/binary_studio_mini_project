package com.threadjava.comment.dto;

import com.threadjava.users.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
public class CommentDetailsQueryResult {
    private UUID id;
    private String body;
    private User user;
    private Date createdAt;
    private long likeCount;
    private long dislikeCount;
}

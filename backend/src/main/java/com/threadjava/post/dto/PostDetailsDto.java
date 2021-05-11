package com.threadjava.post.dto;

import com.threadjava.comment.dto.CommentDetailsDto;
import com.threadjava.image.dto.ImageDto;
import com.threadjava.postReactions.dto.PostReactionDto;
import com.threadjava.users.dto.UserShortDto;
import lombok.Data;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
public class PostDetailsDto {
    private UUID id;
    private String body;
    private ImageDto image;
    private UserShortDto user;
    private Date createdAt;
    private Date updatedAt;
    private long likeCount;
    private long dislikeCount;
    private long commentCount;
    private List<CommentDetailsDto> comments = new ArrayList<>();
    private List<PostReactionDto> reactions = new ArrayList<>();
}

package com.threadjava.commentReactions.dto;

import com.threadjava.users.dto.UserShortDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentReactionDto {
    UserShortDto user;
    Boolean isLike;
}

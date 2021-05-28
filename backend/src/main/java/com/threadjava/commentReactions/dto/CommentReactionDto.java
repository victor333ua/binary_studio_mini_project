package com.threadjava.commentReactions.dto;

import com.threadjava.users.dto.UserDetailsDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentReactionDto {
    UserDetailsDto user;
    Boolean isLike;
}

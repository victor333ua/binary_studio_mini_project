package com.threadjava.commentReactions.dto;

import com.threadjava.users.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QueryCommentReaction {
    User user;
    Boolean isLike;
}

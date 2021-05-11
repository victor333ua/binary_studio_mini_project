package com.threadjava.postReactions.dto;

import com.threadjava.users.model.User;
import lombok.*;

@Data
@AllArgsConstructor
public class QueryPostReaction {
    User user;
    Boolean isLike;
}

package com.threadjava.post;

import com.threadjava.post.dto.PostDetailsQueryResult;
import java.util.List;
import java.util.UUID;

public interface PostsCustomRepository {
    List<PostDetailsQueryResult> getAllPostsMyOrNot(Integer from, Integer count, UUID userId, Boolean isMine);
}

package com.threadjava.post;

import com.threadjava.post.dto.PostListQueryResult;

import java.awt.print.Pageable;
import java.util.List;
import java.util.UUID;

public interface PostsCustomRepository {
    public List<PostListQueryResult> getAllPostsMyOrNot(Integer from, Integer count, UUID userId, Boolean isMine);
}

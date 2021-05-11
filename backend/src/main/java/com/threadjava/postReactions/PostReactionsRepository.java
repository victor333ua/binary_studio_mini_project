package com.threadjava.postReactions;

import com.threadjava.post.model.Post;
import com.threadjava.postReactions.dto.QueryPostReaction;
import com.threadjava.postReactions.model.PostReaction;
import com.threadjava.postReactions.model.PostReactionId;
import com.threadjava.users.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PostReactionsRepository extends CrudRepository<PostReaction, PostReactionId> {
    @Query("SELECT r " +
            "FROM PostReaction r " +
            "WHERE r.user.id = :userId AND r.post.id = :postId ")
    Optional<PostReaction> getPostReaction(@Param("userId") UUID userId, @Param("postId") UUID postId);

    @Query("select new com.threadjava.postReactions.dto.QueryPostReaction(pr.user, pr.isLike) " +
            "from PostReaction pr where pr.post.id = :postId")
    List<QueryPostReaction> getByPostId(@Param("postId") UUID postId);

    void deletePostReactionByUserAndPost(User u, Post p);
}

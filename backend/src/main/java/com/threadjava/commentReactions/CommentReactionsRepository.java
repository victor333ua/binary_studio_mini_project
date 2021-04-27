package com.threadjava.commentReactions;

import com.threadjava.commentReactions.model.CommentReaction;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface CommentReactionsRepository extends CrudRepository<CommentReaction, UUID> {

    @Query("select cr from CommentReaction cr where cr.comment.id = :commentId and cr.user.id = :userId")
    Optional<CommentReaction> getReaction(@Param("commentId") UUID commentId, @Param("userId") UUID userId);
}

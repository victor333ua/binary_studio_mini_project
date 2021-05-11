package com.threadjava.commentReactions;

import com.threadjava.commentReactions.dto.QueryCommentReaction;
import com.threadjava.commentReactions.model.CommentReaction;
import com.threadjava.commentReactions.model.CommentReactionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CommentReactionsRepository extends JpaRepository<CommentReaction, CommentReactionId> {

    @Query("select cr from CommentReaction cr where cr.id.comment.id = :commentId and cr.id.user.id = :userId")
    Optional<CommentReaction> getReaction(@Param("commentId") UUID commentId, @Param("userId") UUID userId);

    @Query("select new com.threadjava.commentReactions.dto.QueryCommentReaction(cr.id.user, cr.isLike) " +
            "from CommentReaction cr where cr.id.comment.id = :commentId")
    List<QueryCommentReaction> getByCommentId(@Param("commentId") UUID commentId);

    @Transactional
    @Modifying
    @Query("delete from CommentReaction cr where cr.id.comment.id = :commentId and cr.id.user.id = :userId")
    void deleteByComposedId(@Param("commentId") UUID commentId, @Param("userId") UUID userId);
}

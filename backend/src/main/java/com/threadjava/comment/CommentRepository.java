package com.threadjava.comment;

import com.threadjava.comment.dto.CommentDetailsQueryResult;
import com.threadjava.comment.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {

    List<Comment> findAllByPostId(UUID postId);

    @Query("select new com.threadjava.comment.dto.CommentDetailsQueryResult(c.id, c.body, c.user, c.createdAt, " +
            "(select count(*) from CommentReaction cr where cr.id.comment = c and cr.isLike = true), " +
            "(select count(*) from CommentReaction cr where cr.id.comment = c and cr.isLike = false)) " +
            "from Comment c " +
            "where (c.post.id = :postId and c.deleted = false) " +
            "order by c.createdAt desc" )
    List<CommentDetailsQueryResult> findAllCommentDetailsByPostId(@Param("postId") UUID postId);

    @Query("select new com.threadjava.comment.dto.CommentDetailsQueryResult(c.id, c.body, c.user, c.createdAt, " +
            "(select count(*) from CommentReaction cr where cr.id.comment = c and cr.isLike = true), " +
            "(select count(*) from CommentReaction cr where cr.id.comment = c and cr.isLike = false)) " +
            "from Comment c " +
            "where (c.id = :id and c.deleted = false) ")
    Optional<CommentDetailsQueryResult> findCommentDetailsById(@Param("id") UUID id);
}

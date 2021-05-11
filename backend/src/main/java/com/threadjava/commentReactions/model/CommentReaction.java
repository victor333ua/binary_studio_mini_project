package com.threadjava.commentReactions.model;

import com.threadjava.comment.model.Comment;
import com.threadjava.users.model.User;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "comment_reactions")
public class CommentReaction {

    @EmbeddedId
    private CommentReactionId id;

    @Column(name = "is_like")
    Boolean isLike;

    public CommentReaction(CommentReactionId id, Boolean isLike) {
        this.id = id;
        this.isLike = isLike;
    }
    public CommentReaction(Comment comment, User user, Boolean isLike) {
        this.id = new CommentReactionId(comment, user);
        this.isLike = isLike;
    }

    public CommentReaction() {
        this.id = new CommentReactionId();
    }

    public CommentReactionId getid() {
        return this.id;
    }

    public Boolean getIsLike() {
        return this.isLike;
    }

    public void setid(CommentReactionId id) {
        this.id = id;
    }

    public void setIsLike(Boolean isLike) {
        this.isLike = isLike;
    }

    public Comment getComment() {
        return id.getComment();
    }

    public void setComment(Comment comment) {
        id.setComment(comment);
    }

    public User getUser() {
        return id.getUser();
    }

    public void setUser(User user) {
        id.setUser(user);
    }
}

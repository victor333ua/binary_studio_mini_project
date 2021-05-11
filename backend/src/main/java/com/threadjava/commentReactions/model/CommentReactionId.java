package com.threadjava.commentReactions.model;

import com.threadjava.comment.model.Comment;
import com.threadjava.users.model.User;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Data
public class CommentReactionId implements Serializable {

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
    @JoinColumn(name = "comment_id")
    private Comment comment;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
    @JoinColumn(name = "user_id")
    private User user;

    public CommentReactionId(Comment comment, User user) {
        this.comment = comment;
        this.user = user;
    }

    public CommentReactionId() {
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof CommentReactionId)) return false;
        final CommentReactionId other = (CommentReactionId) o;
        if (!other.canEqual((Object) this)) return false;
        final UUID this$comment = this.getComment().getId();
        final UUID other$comment = other.getComment().getId();
        if (this$comment == null ? other$comment != null : !this$comment.equals(other$comment)) return false;
        final UUID this$user = this.getUser().getId();
        final UUID other$user = other.getUser().getId();
        return this$user == null ? other$user == null : this$user.equals(other$user);
    }

    protected boolean canEqual(final Object other) {
        return other instanceof CommentReactionId;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final UUID $comment = this.getComment().getId();
        result = result * PRIME + ($comment == null ? 43 : $comment.hashCode());
        final UUID $user = this.getUser().getId();
        result = result * PRIME + ($user == null ? 43 : $user.hashCode());
        return result;
    }
}

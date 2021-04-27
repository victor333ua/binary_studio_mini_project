package com.threadjava.commentReactions.model;

import com.threadjava.comment.model.Comment;
import com.threadjava.db.BaseEntity;
import com.threadjava.users.model.User;
import lombok.Data;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Data
@Table(name = "comment_reactions")
public class CommentReaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
    @JoinColumn(name = "comment_id")
    private Comment comment;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "is_like")
    Boolean isLike;
}

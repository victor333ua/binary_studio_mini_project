package com.threadjava.postReactions.model;

import com.threadjava.db.BaseEntity;
import com.threadjava.post.model.Post;
import com.threadjava.users.model.User;
import lombok.*;

import javax.persistence.*;

@Data
@Entity
@Table(name = "post_reactions")
public class PostReaction extends BaseEntity {

    @Column(name = "is_like")
    private Boolean isLike;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
    @JoinColumn(name = "post_id")
    private Post post;

    public PostReaction() {
    }

    protected boolean canEqual(final Object other) {
        return other instanceof PostReaction;
    }

}

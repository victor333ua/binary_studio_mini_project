package com.threadjava.postReactions.model;

import com.threadjava.post.model.Post;
import com.threadjava.users.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "post_reactions")
@IdClass(PostReactionId.class)
public class PostReaction {

    @Id
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
    @JoinColumn(name = "post_id")
    private Post post;

    @Column(name = "is_like")
    private Boolean isLike;

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof PostReaction)) return false;
        final PostReaction other = (PostReaction) o;
        if (!other.canEqual((Object) this)) return false;
        var prId = new PostReactionId(this.post.getId(), this.user.getId());
        var prOtherId = new PostReactionId(other.post.getId(), other.user.getId());
        return prId.equals(prOtherId);
    }

    protected boolean canEqual(final Object other) {
        return other instanceof PostReaction;
    }

    public int hashCode() {
        var prId = new PostReactionId(this.post.getId(), this.user.getId());
        return prId.hashCode();
    }
}

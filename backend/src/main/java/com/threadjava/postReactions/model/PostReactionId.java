package com.threadjava.postReactions.model;

import com.threadjava.post.model.Post;
import com.threadjava.users.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostReactionId implements Serializable {
    private UUID post;
    private UUID user;

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof PostReactionId)) return false;
        final PostReactionId other = (PostReactionId) o;
        if (!other.canEqual((Object) this)) return false;
        final UUID this$post = this.post;
        final UUID other$post = other.post;
        if (this$post == null ? other$post != null : !this$post.equals(other$post)) return false;
        final UUID this$user = this.user;
        final UUID other$user = other.user;
        if (this$user == null ? other$user != null : !this$user.equals(other$user)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof PostReactionId;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final UUID $post = this.post;
        result = result * PRIME + ($post == null ? 43 : $post.hashCode());
        final UUID $user = this.user;
        result = result * PRIME + ($user == null ? 43 : $user.hashCode());
        return result;
    }
}

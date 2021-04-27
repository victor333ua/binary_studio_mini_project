package com.threadjava.commentReactions;

import com.threadjava.commentReactions.dto.CommentReactionDto;
import com.threadjava.post.PostsService;
import com.threadjava.postReactions.dto.PostReactionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

import static com.threadjava.auth.TokenService.getUserId;

@RestController
@RequestMapping("/api/commentreaction")
public class CommentReactionController {
    @Autowired
    private CommentReactionService commentReactionService;

    @PutMapping
    public Optional<Boolean> setReaction(@RequestBody CommentReactionDto commentReaction) throws Exception {
        var currentUser = getUserId();
        commentReaction.setUserId(currentUser);
        var isNewRecord = commentReactionService.setReaction(commentReaction);
        return isNewRecord;
    }
}

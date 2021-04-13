package com.threadjava.postReactions;

import com.threadjava.postReactions.dto.PostReactionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Optional;

import static com.threadjava.auth.TokenService.getUserId;

@RestController
@RequestMapping("/api/postreaction")
public class PostReactionController {
    @Autowired
    private PostReactionService postsService;
    @Autowired
    private SimpMessagingTemplate template;

    @PutMapping
    public Optional<Boolean> setReaction(@RequestBody PostReactionDto postReaction) throws Exception {
        var currentUser = getUserId();
        postReaction.setUserId(currentUser);
        var isNewRecord = postsService.setReaction(postReaction);

//        if (reaction.isPresent() && reaction.get().getUserId() != getUserId()) {
        if (isNewRecord.isPresent() && postReaction.getPostOwnerId() != currentUser) {
            // notify a user if someone (not himself) liked his post
            template.convertAndSend("/topic/like", "Your post was liked!");
        }
        return isNewRecord;
    }
}

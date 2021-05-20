package com.threadjava.commentReactions;

import com.threadjava.commentReactions.dto.CommentReactionCreationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

import static com.threadjava.auth.TokenService.getUserId;

@RestController
@RequestMapping("/api/commentReaction")
public class CommentReactionController {
    @Autowired
    private CommentReactionService commentReactionService;
    @Autowired
    private SimpMessagingTemplate template;

    @PutMapping
    public Optional<Boolean> setReaction(@RequestBody CommentReactionCreationDto commentReaction) throws Exception {

        var optIsNewRecord = commentReactionService.setReaction(commentReaction);

// notify everyone about likes/dislikes the comment
        Boolean isNewRecord = optIsNewRecord.orElse(null);
        commentReaction.setIsNewRecord(isNewRecord);

        template.convertAndSend("/topic/comments/like", commentReaction);

        return optIsNewRecord;
    }
}

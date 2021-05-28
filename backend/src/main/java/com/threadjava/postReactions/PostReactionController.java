package com.threadjava.postReactions;

import com.threadjava.mail.EmailService;
import com.threadjava.postReactions.dto.PostReactionCreationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Optional;

import static com.threadjava.auth.TokenService.getUserId;

@RestController
@RequestMapping("/api/postReaction")
public class PostReactionController {
    @Autowired
    private PostReactionService postsService;
    @Autowired
    private SimpMessagingTemplate template;
    @Autowired
    EmailService emailService;

    @PutMapping
    public Optional<Boolean> setReaction(@RequestBody PostReactionCreationDto postReaction) throws Exception {

        var optIsNewRecord = postsService.setReaction(postReaction);

// notify everyone about likes/dislikes the post
        Boolean isNewRecord = optIsNewRecord.orElse(null);
        postReaction.setIsNewRecord(isNewRecord);

        template.convertAndSend("/topic/post/like", postReaction);

// send email to postOwner if like
        if(postReaction.getIsLike() && isNewRecord != null)
            emailService.sendSimpleMessage(
                    null, postReaction.getPostOwner().getEmail(),
                    "Notification message from Thread",
                    String.format("Your post from %tD was liked", postReaction.getCreatedAt()));

        return optIsNewRecord;
    }
}

package com.threadjava.comment;

import com.threadjava.comment.dto.CommentDetailsDto;
import com.threadjava.comment.dto.CommentSaveDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

import static com.threadjava.auth.TokenService.getUserId;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;
    @Autowired
    private SimpMessagingTemplate template;

    @GetMapping("/{id}")
    public CommentDetailsDto get(@PathVariable UUID id) {
        return commentService.getCommentDetailsById(id);
    }

    @PostMapping
    public CommentDetailsDto create(@RequestBody CommentSaveDto commentDto) {
        commentDto.setUserId(getUserId());
        var commentId = commentService.create(commentDto);
        var comment = commentService.getCommentDetailsById(commentId);

        comment.setPostId(commentDto.getPostId());
        template.convertAndSend("/topic/comments/add", comment);

        return comment;
    }

    @PutMapping
    public void update(@RequestBody CommentSaveDto commentDto) {
        commentDto.setUserId(getUserId());
        commentService.update(commentDto);
        template.convertAndSend("/topic/comments/update", commentDto);
    }

    @DeleteMapping
    public void delete(@RequestBody CommentSaveDto commentDto) {
        commentDto.setUserId(getUserId());
        commentService.delete(commentDto.getId());
        template.convertAndSend("/topic/comments/delete", commentDto);
    }
}

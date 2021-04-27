package com.threadjava.comment;

import com.threadjava.comment.dto.CommentDetailsDto;
import com.threadjava.comment.dto.CommentDetailsWithLikesDto;
import com.threadjava.comment.dto.CommentSaveDto;
import com.threadjava.comment.dto.CommentUpdateDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import static com.threadjava.auth.TokenService.getUserId;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @GetMapping("/{id}")
    public CommentDetailsWithLikesDto get(@PathVariable UUID id) {
        return commentService.getCommentDetailsById(id); }

    @PostMapping
    public CommentDetailsDto post(@RequestBody CommentSaveDto commentDto) {
        commentDto.setUserId(getUserId());
        return commentService.create(commentDto);
    }

    @PutMapping
    public void update(@RequestBody CommentUpdateDto commentDto) {
        commentService.update(commentDto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        commentService.delete(id);
    }
}

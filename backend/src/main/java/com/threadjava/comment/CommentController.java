package com.threadjava.comment;

import com.threadjava.comment.dto.CommentDetailsDto;
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
    public CommentDetailsDto get(@PathVariable UUID id) {
        return commentService.getCommentDetailsById(id);
    }

    @PostMapping
    public String post(@RequestBody CommentSaveDto commentSaveDto) {
        commentSaveDto.setUserId(getUserId());
        return commentService.create(commentSaveDto);
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

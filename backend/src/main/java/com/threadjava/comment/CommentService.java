package com.threadjava.comment;

import com.threadjava.comment.dto.CommentDetailsDto;
import com.threadjava.comment.dto.CommentSaveDto;
import com.threadjava.comment.dto.CommentUpdateDto;
import com.threadjava.commentReactions.CommentReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private CommentReactionService commentReactionsService;

    public String create(CommentSaveDto commentDto) {
        var comment = CommentMapper.MAPPER.commentSaveDtoToModel(commentDto);
        var commentCreated = commentRepository.save(comment);
        return commentCreated.getId().toString();
    }

    public List<CommentDetailsDto> getAllCommentDetailsByPostId(UUID postId) {
        return commentRepository.findAllCommentDetailsByPostId(postId)
                .stream()
                .map(queryComment -> {
                    var commentDto = CommentMapper.MAPPER.queryCommentToCommentDetaisDto(queryComment);
                    var reactionsDto = commentReactionsService.getCommentReactionsByCommentId(queryComment.getId());
                    commentDto.setReactions(reactionsDto);
                    return commentDto;
                })
                .collect(Collectors.toList());
    }

    public CommentDetailsDto getCommentDetailsById(UUID id) {
        var queryComment = commentRepository.findCommentDetailsById(id)
                .orElseThrow();
        var commentDto = CommentMapper.MAPPER.queryCommentToCommentDetaisDto(queryComment);
        var reactionsDto = commentReactionsService.getCommentReactionsByCommentId(id);
        commentDto.setReactions(reactionsDto);
        return commentDto;
    }

    public void update(CommentUpdateDto commentDto) {
        var comment = commentRepository.findById(commentDto.getId())
                .orElseThrow();
        comment.setBody(commentDto.getBody());
        commentRepository.save(comment);
    }

    @Transactional
    public void delete(UUID id) {
        commentRepository.deleteById(id);
    }
}

package com.threadjava.comment;

import com.threadjava.comment.dto.CommentDetailsDto;
import com.threadjava.comment.dto.CommentDetailsWithLikesDto;
import com.threadjava.comment.dto.CommentSaveDto;
import com.threadjava.comment.dto.CommentUpdateDto;
import com.threadjava.post.PostMapper;
import com.threadjava.post.PostsRepository;
import com.threadjava.users.UsersRepository;
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

    public CommentDetailsDto getCommentById(UUID id) {
        return commentRepository.findById(id)
                .map(CommentMapper.MAPPER::commentToCommentDetailsDto)
                .orElseThrow();
    }

    public CommentDetailsDto create(CommentSaveDto commentDto) {
        var comment = CommentMapper.MAPPER.commentSaveDtoToModel(commentDto);
        var postCreated = commentRepository.save(comment);
        return CommentMapper.MAPPER.commentToCommentDetailsDto(postCreated);
    }

    public List<CommentDetailsWithLikesDto> getCommentsByPostId(UUID postId) {
        return commentRepository.findAllCommentsDetailsByPostId(postId)
                .stream()
                .map(CommentMapper.MAPPER::commentToCommentDto)
                .collect(Collectors.toList());
    }

    public CommentDetailsWithLikesDto getCommentDetailsById(UUID id) {
        var comment = commentRepository.findCommentsDetailsById(id)
                .orElseThrow();
        return CommentMapper.MAPPER.commentToCommentDto(comment);
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

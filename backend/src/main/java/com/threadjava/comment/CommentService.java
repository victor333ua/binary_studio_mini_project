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

    public List<CommentDetailsWithLikesDto> getCommentsDetailsWithLikesByPostId(UUID postId) {
        return commentRepository.findAllCommentsDetailsWithLikesByPostId(postId)
                .stream()
                .map(CommentMapper.MAPPER::commentToCommentDetaisWithLikesDto)
                .collect(Collectors.toList());
    }

    public CommentDetailsWithLikesDto getCommentDetailsWithLikesById(UUID id) {
        var comment = commentRepository.findCommentsDetailsWithLikesById(id)
                .orElseThrow();
        return CommentMapper.MAPPER.commentToCommentDetaisWithLikesDto(comment);
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

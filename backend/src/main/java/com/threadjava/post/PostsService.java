package com.threadjava.post;

import com.threadjava.comment.CommentRepository;
import com.threadjava.comment.CommentService;
import com.threadjava.post.dto.*;
import com.threadjava.post.model.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PostsService {
    @Autowired
    private PostsRepository postsCrudRepository;
    @Autowired
    private CommentService commentService;

    public List<PostListDto> getAllPosts(Integer from, Integer count, UUID userId) {
        var pageable = PageRequest.of(from / count, count);
        return postsCrudRepository
                .findAllPosts(userId, pageable)
                .stream()
                .map(PostMapper.MAPPER::queryPostListToPostListDto)
                .collect(Collectors.toList());
    }

    public PostDetailsDto getPostById(UUID id) {
        var post = postsCrudRepository.findPostById(id)
                .map(PostMapper.MAPPER::queryPostToPostDetailsDto)
                .orElseThrow();

        var comments = commentService.getCommentsDetailsWithLikesByPostId(id);
        post.setComments(comments);

        return post;
    }

    public UUID create(PostCreationDto postDto) {
        Post post = PostMapper.MAPPER.postCreationDtoToPost(postDto);
        Post postCreated = postsCrudRepository.save(post);
        return postCreated.getId();
    }
    @Transactional
    public void delete (UUID id) {
        postsCrudRepository.deleteById(id);
    }

    public void update(PostUpdateDto postUpdateDto) {
        var post = PostMapper.MAPPER.postUpdateDtoToPost(postUpdateDto);
        postsCrudRepository.save(post);
    }
}

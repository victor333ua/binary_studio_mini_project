package com.threadjava.post;

import com.threadjava.comment.CommentRepository;
import com.threadjava.comment.CommentService;
import com.threadjava.image.ImageMapper;
import com.threadjava.post.dto.*;
import com.threadjava.post.model.Post;
import com.threadjava.postReactions.PostReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Modifying;
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
    @Autowired
    private PostReactionService postReactionService;

    public List<PostDetailsDto> getAllPosts(Integer from, Integer count, UUID userId, Boolean isMine) {

        var pageable = PageRequest.of(from / count, count);
        List<PostDetailsQueryResult> list;

        if(userId == null) list = postsCrudRepository.getAllPostsMyOrNot(from, count, userId, isMine);
        else {
            if(isMine == null)  list = postsCrudRepository.findAllPostsWithMyLikes(userId, pageable);
            else
                list = postsCrudRepository.getAllPostsMyOrNot(from, count, userId, isMine);
        }
        return list
                .stream()
                .map(queryPost -> {
                    var postDetailsDto = PostMapper.MAPPER.queryPostToPostDetailsDto(queryPost);
                    var reactionsDto = postReactionService.getPostReactionsByPostId(queryPost.getId());
                    postDetailsDto.setReactions(reactionsDto);
                    return postDetailsDto;
                })
                .collect(Collectors.toList());
    }

    public PostDetailsDto getPostById(UUID id) {
        var post = postsCrudRepository.findPostById(id)
                .map(PostMapper.MAPPER::queryPostToPostDetailsDto)
                .orElseThrow();

        var comments = commentService.getAllCommentDetailsByPostId(id);
        post.setComments(comments);

        var reactionsDto = postReactionService.getPostReactionsByPostId(id);
        post.setReactions(reactionsDto);

        return post;
    }

    public PostCreationResponseDto create(PostCreationDto postDto) {
        Post post = PostMapper.MAPPER.postCreationDtoToPost(postDto);
        post = postsCrudRepository.save(post);
        return PostMapper.MAPPER.postToPostCreationResponseDto(post);
    }
    @Transactional
    public void delete (UUID id) {
        postsCrudRepository.deleteById(id);
    }

    @Transactional
    @Modifying
    public void update(PostUpdateDto postUpdateDto) {
        var post = postsCrudRepository.getOne(postUpdateDto.getId());
        post.setBody(postUpdateDto.getBody());
        post.setImage(ImageMapper.MAPPER.imageDtoToImage(postUpdateDto.getImage()));
        postsCrudRepository.save(post);
    }
}

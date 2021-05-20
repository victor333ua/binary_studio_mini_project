package com.threadjava.post;

import com.threadjava.post.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

import static com.threadjava.auth.TokenService.getUserId;

@RestController
@RequestMapping("/api/posts")
public class PostsController {
    @Autowired
    private PostsService postsService;
    @Autowired
    private SimpMessagingTemplate template;

    @GetMapping
    public List<PostDetailsDto> get(@RequestParam(defaultValue="0") Integer from,
                                 @RequestParam(defaultValue="10") Integer count,
                                 @RequestParam(required = false) UUID userId,
                                 @RequestParam(required = false) Boolean isMine) {
        return postsService.getAllPosts(from, count, userId, isMine);
    }

    @GetMapping("/{id}")
    public PostDetailsDto get(@PathVariable UUID id) {
        return postsService.getPostById(id);
    }

    @PostMapping
    public PostCreationResponseDto post(@RequestBody PostCreationDto postDto) {
        postDto.setUserId(getUserId());
        var postResponse = postsService.create(postDto);

        template.convertAndSend("/topic/post/new", postResponse);

        return postResponse;
    }
    @DeleteMapping
    public void delete(@RequestBody PostDeleteDto postDeleteDto) {
        postsService.delete(postDeleteDto.getId());

        template.convertAndSend("/topic/post/delete", postDeleteDto);
    }

    @PutMapping
    public void update(@RequestBody PostUpdateDto postUpdateDto) {
        postsService.update(postUpdateDto);

        template.convertAndSend("/topic/post/update", postUpdateDto);

    }

}

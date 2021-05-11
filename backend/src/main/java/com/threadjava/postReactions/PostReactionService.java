package com.threadjava.postReactions;

import com.threadjava.postReactions.dto.PostReactionCreationDto;
import com.threadjava.postReactions.dto.PostReactionDto;
import com.threadjava.postReactions.model.PostReaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PostReactionService {
    @Autowired
    private PostReactionsRepository postReactionsRepository;

    @Transactional
    @Modifying
    public Optional<Boolean> setReaction(PostReactionCreationDto postReactionDto) throws Exception {
        Optional<PostReaction> reaction;
        try {
            reaction = postReactionsRepository
                    .getPostReaction(postReactionDto.getUserId(), postReactionDto.getPostId());
        } catch (Exception e) {
            throw new Exception("search of reaction unsuccessful may be due to double rows");
        }
        if (reaction.isPresent()) {
            var react = reaction.get();
            // if you click accidentally, you may to roll back by click once more
            if (react.getIsLike() == postReactionDto.getIsLike()) {
                postReactionsRepository.deletePostReactionByUserAndPost(react.getUser(), react.getPost());
                return Optional.empty();// delete record in case of double usage
            } else {
                react.setIsLike(postReactionDto.getIsLike());
                postReactionsRepository.save(react);
                return Optional.of(false); // update record w/o create new
            }
        } else {
            var postReaction = PostReactionMapper.MAPPER.dtoToPostReaction(postReactionDto);
            postReactionsRepository.save(postReaction);
            return Optional.of(true); // create new
        }
    }

    public List<PostReactionDto> getPostReactionsByPostId(UUID postId) {
        return postReactionsRepository.getByPostId(postId)
                .stream()
                .map(PostReactionMapper.MAPPER::queryPostReactionToPostReactionDto)
                .collect(Collectors.toList());
    }
}

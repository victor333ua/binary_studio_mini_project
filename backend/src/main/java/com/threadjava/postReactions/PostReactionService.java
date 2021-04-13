package com.threadjava.postReactions;

import com.threadjava.postReactions.dto.PostReactionDto;
import com.threadjava.postReactions.model.PostReaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PostReactionService {
    @Autowired
    private PostReactionsRepository postReactionsRepository;

    public Optional<Boolean> setReaction(PostReactionDto postReactionDto) throws Exception {

        Optional<PostReaction> reaction;
        try {
            reaction = postReactionsRepository
                    .getPostReaction(postReactionDto.getUserId(), postReactionDto.getPostId());
        } catch (Exception e) {
            throw new Exception("search of reaction unsuccessful");
        }

        if (reaction.isPresent()) {
            var react = reaction.get();
            // if you click accidentally, you may to roll back by click once more
            if (react.getIsLike() == postReactionDto.getIsLike()) {
                postReactionsRepository.deleteById(react.getId());
                return Optional.empty();// delete record if double usage
            } else {
                react.setIsLike(postReactionDto.getIsLike());
                var result = postReactionsRepository.save(react);
//
                return Optional.of(false); // update record w/o create new
            }
        } else {
            var postReaction = PostReactionMapper.MAPPER.dtoToPostReaction(postReactionDto);
            var result = postReactionsRepository.save(postReaction);
//
            return Optional.of(true); // create new
        }
    }
}

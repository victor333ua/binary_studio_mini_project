package com.threadjava.commentReactions;

import com.threadjava.commentReactions.dto.CommentReactionDto;
import com.threadjava.postReactions.PostReactionMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CommentReactionService {
    @Autowired
    private CommentReactionsRepository commentReactionsRepository;

    public Optional<Boolean> setReaction(CommentReactionDto commentReactionDto) {

        var reaction = commentReactionsRepository
                .getReaction(commentReactionDto.getCommentId(), commentReactionDto.getUserId());

        if (reaction.isPresent()) {
            var react = reaction.get();
            // if you click accidentally, you may to roll back by click once more
            if (react.getIsLike() == commentReactionDto.getIsLike()) {
                commentReactionsRepository.deleteById(react.getId());
                return Optional.empty();// delete record in case of double usage
            } else {
                react.setIsLike(commentReactionDto.getIsLike());
                var result = commentReactionsRepository.save(react);
                //
                return Optional.of(false); // update record w/o create new
            }
        } else {
            var postReaction = CommentReactionMapper.MAPPER.dtoToCommentReaction(commentReactionDto);
            var result = commentReactionsRepository.save(postReaction);
            return Optional.of(true); // create new
        }
    }
}

package com.threadjava.commentReactions;

import com.threadjava.commentReactions.dto.CommentReactionCreationDto;
import com.threadjava.commentReactions.dto.CommentReactionDto;
import com.threadjava.commentReactions.model.CommentReaction;
import com.threadjava.postReactions.PostReactionMapper;
import com.threadjava.postReactions.dto.PostReactionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommentReactionService {
    @Autowired
    private CommentReactionsRepository commentReactionsRepository;

    public Optional<Boolean> setReaction(CommentReactionCreationDto commentReactionDto) throws Exception {

        var commentId = commentReactionDto.getCommentId();
        var userId = commentReactionDto.getCurrentUser().getId();
        Optional<CommentReaction> reaction;
        try {
            reaction = commentReactionsRepository.getReaction(commentId, userId);
        } catch (Exception e) {
            throw new Exception("search of comment's reaction unsuccessful may be due to double rows");
        }

        if (reaction.isPresent()) {
            var react = reaction.get();
            // if you click accidentally, you may to roll back by click once more
            if (react.getIsLike() == commentReactionDto.getIsLike()) {
                commentReactionsRepository.deleteByComposedId(commentId, userId);
                return Optional.empty();// delete record in case of double usage
            } else {
                react.setIsLike(commentReactionDto.getIsLike());
                commentReactionsRepository.save(react); // react is in persistent state
                return Optional.of(false); // update record w/o create new
            }
        } else {
            var commentReaction = CommentReactionMapper.MAPPER.dtoToCommentReaction(commentReactionDto);
            commentReactionsRepository.save(commentReaction);
            return Optional.of(true); // create new
        }
    }

    public List<CommentReactionDto> getCommentReactionsByCommentId(UUID commentId) {
        return commentReactionsRepository.getByCommentId(commentId)
                .stream()
                .map(CommentReactionMapper.MAPPER::queryCommentReactionToCommentReactionDto)
                .collect(Collectors.toList());
    }
}

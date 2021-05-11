package com.threadjava.commentReactions;

import com.threadjava.comment.model.Comment;
import com.threadjava.commentReactions.dto.CommentReactionCreationDto;
import com.threadjava.commentReactions.dto.CommentReactionDto;
import com.threadjava.commentReactions.dto.QueryCommentReaction;
import com.threadjava.commentReactions.model.CommentReaction;
import com.threadjava.commentReactions.model.CommentReactionId;
import com.threadjava.users.UserMapper;
import com.threadjava.users.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(uses = { UserMapper.class })
public abstract class CommentReactionMapper {
    public static final CommentReactionMapper MAPPER = Mappers.getMapper(CommentReactionMapper.class);

    public abstract CommentReactionDto queryCommentReactionToCommentReactionDto(QueryCommentReaction queryCommentReaction);

    //    @Mapping(source = "commentId", target = "composedId.comment.id")
    //    @Mapping(source = "userId", target = "composedId.user.id")
    public CommentReaction dtoToCommentReaction(CommentReactionCreationDto commentReactionDto) {

        var comment = new Comment();
        comment.setId(commentReactionDto.getCommentId());
        var user = new User();
        user.setId(commentReactionDto.getUserId());

        var composedId = new CommentReactionId(comment, user);

        return new CommentReaction(composedId, commentReactionDto.getIsLike());

    }
}

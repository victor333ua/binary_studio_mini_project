package com.threadjava.commentReactions;

import com.threadjava.commentReactions.dto.CommentReactionDto;
import com.threadjava.commentReactions.model.CommentReaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CommentReactionMapper {
    CommentReactionMapper MAPPER = Mappers.getMapper(CommentReactionMapper.class);

    @Mapping(source = "commentId", target = "comment.id")
    @Mapping(source = "userId", target = "user.id")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    public CommentReaction dtoToCommentReaction(CommentReactionDto commentReactionDto);
}

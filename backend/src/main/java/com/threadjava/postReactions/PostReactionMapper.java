package com.threadjava.postReactions;

import com.threadjava.postReactions.dto.PostReactionCreationDto;
import com.threadjava.postReactions.dto.PostReactionDto;
import com.threadjava.postReactions.dto.QueryPostReaction;
import com.threadjava.postReactions.model.PostReaction;
import com.threadjava.users.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper (uses = { UserMapper.class })
public interface PostReactionMapper {
    PostReactionMapper MAPPER = Mappers.getMapper(PostReactionMapper.class);

    PostReactionDto queryPostReactionToPostReactionDto(QueryPostReaction queryPostReaction);

    @Mapping(source = "userId", target = "user.id")
    @Mapping(source = "postId", target = "post.id")
    PostReaction dtoToPostReaction(PostReactionCreationDto postReactionDto);
}

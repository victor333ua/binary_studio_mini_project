package com.threadjava.comment;

import com.threadjava.comment.dto.CommentDetailsDto;
import com.threadjava.comment.dto.CommentDetailsQueryResult;
import com.threadjava.comment.dto.CommentSaveDto;
import com.threadjava.comment.model.Comment;
import com.threadjava.users.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(uses={UserMapper.class})
public interface CommentMapper {
    CommentMapper MAPPER = Mappers.getMapper(CommentMapper.class);

    // to create comment
    @Mapping(source = "postId", target = "post.id")
    @Mapping(source = "userId", target = "user.id")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Comment commentSaveDtoToModel(CommentSaveDto commentDto);

    // to return comment details
    @Mapping(target = "reactions", ignore = true)
    CommentDetailsDto queryCommentToCommentDetaisDto(CommentDetailsQueryResult queryComment);

//    @Mapping(source = "avatar", target = "image")
//    default UserShortDto userToUserShortDto(User model);
}

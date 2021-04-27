package com.threadjava.comment;

import com.threadjava.comment.dto.CommentDetailsDto;
import com.threadjava.comment.dto.CommentDetailsQueryResult;
import com.threadjava.comment.dto.CommentDetailsWithLikesDto;
import com.threadjava.comment.dto.CommentSaveDto;
import com.threadjava.comment.model.Comment;
import com.threadjava.users.dto.UserDetailsDto;
import com.threadjava.users.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CommentMapper {
    CommentMapper MAPPER = Mappers.getMapper(CommentMapper.class);

    @Mapping(source = "post.id", target = "postId")
    CommentDetailsDto commentToCommentDetailsDto(Comment comment);

    @Mapping(source = "postId", target = "post.id")
    @Mapping(source = "userId", target = "user.id")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Comment commentSaveDtoToModel(CommentSaveDto commentDto);

    CommentDetailsWithLikesDto commentToCommentDto(CommentDetailsQueryResult comment);

    @Mapping(source = "avatar", target = "image")
    UserDetailsDto postUserToPostUserDto(User model);
}

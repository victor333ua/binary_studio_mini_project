package com.threadjava.users;

import com.threadjava.post.PostMapper;
import com.threadjava.post.model.Post;
import com.threadjava.users.dto.UserDetailsDto;
import com.threadjava.users.dto.UserShortDto;
import com.threadjava.users.model.User;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper
public abstract class UserMapper {
    public static final UserMapper MAPPER = Mappers.getMapper( UserMapper.class );

    @Mapping(source = "avatar", target = "image")
    @Mapping(target = "password", ignore = true)
    public abstract UserDetailsDto userToUserDetailsDto(User user);

    @Mapping(source = "avatar", target = "image")
    public abstract UserShortDto userToUserShortDto(User user);

    @Mapping(source = "image.id", target = "avatar.id", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    @Mapping(source = "image", target = "avatar")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    public abstract User userShortDtoToUser(UserShortDto userShortDto);

    @Mapping(source = "image.id", target = "avatar.id", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    @Mapping(source = "image", target = "avatar")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    public abstract  User userDtoToUser(UserDetailsDto userDto);

    @AfterMapping
    public User doAfterMapping(@MappingTarget User entity) {
        if (entity != null && entity.getAvatar() == null) {
            entity.setAvatar(null);
        }
        return entity;
    }
}

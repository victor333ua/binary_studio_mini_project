package com.threadjava.users;

import com.threadjava.users.dto.UserDetailsDto;
import com.threadjava.users.model.User;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper
public abstract class UserMapper {
    public static final UserMapper MAPPER = Mappers.getMapper( UserMapper.class );

    @Mapping(source = "avatar", target = "image")
    @Mapping(target = "password", ignore = true)
    public abstract UserDetailsDto userToUserDetailsDto(User user);

    @Mapping(source = "image.id", target = "avatar.id", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    @Mapping(source = "image", target = "avatar")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @IterableMapping(nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
    public abstract  User userDtoToUser(UserDetailsDto userDto);

    @AfterMapping
    public User doAfterMapping(@MappingTarget User entity) {
        if (entity != null && entity.getAvatar() == null) {
            entity.setAvatar(null);
        }
        return entity;
    }
}

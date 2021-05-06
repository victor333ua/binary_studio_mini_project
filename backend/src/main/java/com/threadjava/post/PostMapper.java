package com.threadjava.post;
import com.threadjava.post.dto.*;
import com.threadjava.post.model.Post;
import com.threadjava.users.UserMapper;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper (uses = { UserMapper.class })
public abstract class PostMapper {
    public static final PostMapper MAPPER = Mappers.getMapper(PostMapper.class);

    @Mapping(target = "comments", ignore = true)
    public abstract PostDetailsDto queryPostToPostDetailsDto(PostDetailsQueryResult post);

    @Mapping(source = "imageId", target = "image.id", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    @Mapping(source = "userId", target = "user.id")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "reactions", ignore = true)
    public abstract Post postCreationDtoToPost(PostCreationDto postCreationDto);

    @Mapping(source = "image.id", target = "image.id", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "reactions", ignore = true)
    public abstract Post postUpdateDtoToPost(PostUpdateDto postUpdateDto);

    @AfterMapping
    public Post doAfterMapping(@MappingTarget Post entity) {
        if (entity != null && entity.getImage().getId() == null) {
            entity.setImage(null);
        }
        return entity;
    }

    public abstract PostListDto queryPostListToPostListDto(PostListQueryResult model);
}

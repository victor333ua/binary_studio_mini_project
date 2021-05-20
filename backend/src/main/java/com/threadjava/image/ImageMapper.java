package com.threadjava.image;

import com.threadjava.image.dto.ImageDto;
import com.threadjava.image.model.Image;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ImageMapper {
    ImageMapper MAPPER = Mappers.getMapper(ImageMapper.class);

    ImageDto imageToImageDto(Image image);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Image imageDtoToImage(ImageDto imageDto);
}

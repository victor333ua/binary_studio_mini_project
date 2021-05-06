package com.threadjava.users.dto;

import com.threadjava.image.dto.ImageDto;
import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserShortDto {
    private UUID id;
    private String username;
    private ImageDto image;
}

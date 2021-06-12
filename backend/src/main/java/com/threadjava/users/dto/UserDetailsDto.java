package com.threadjava.users.dto;

import com.threadjava.image.dto.ImageDto;
import com.threadjava.role.dto.RoleDto;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class UserDetailsDto {
    private UUID id;
    private String email;
    private String username;
    private ImageDto image;
    private String password;
    private List<RoleDto> roles = new ArrayList<>();
}

package com.threadjava.role;

import com.threadjava.role.dto.RoleDto;
import com.threadjava.role.model.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface RoleMapper {
    com.threadjava.role.RoleMapper MAPPER = Mappers.getMapper(com.threadjava.role.RoleMapper.class);

    RoleDto RoleToRoleDto(Role role);
    Role RoleDtoToRole(RoleDto roleDto);
}

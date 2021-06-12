package com.threadjava.role;

import com.threadjava.role.dto.RoleDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public List<RoleDto> getAllRoles() {
       return roleRepository.findAll()
               .stream()
               .map(RoleMapper.MAPPER::RoleToRoleDto)
               .collect(Collectors.toList());
    }
}

package com.threadjava.role;

import com.threadjava.role.dto.RoleDto;
import com.threadjava.users.dto.UserDetailsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/role")
public class RoleController {
  @Autowired
  private RoleService roleService;

    @GetMapping("/all")
    public List<RoleDto> getAllRoles() { return roleService.getAllRoles(); }
}

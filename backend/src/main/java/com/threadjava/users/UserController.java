package com.threadjava.users;

import com.threadjava.users.dto.UserDetailsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.threadjava.auth.TokenService.getUserId;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UsersService userService;

    @GetMapping
    public UserDetailsDto getUser() {
        return userService.getUserById(getUserId());
    }

    @PutMapping
    public void saveUser(@RequestBody UserDetailsDto userDto) {
        userService.editUser(userDto);
    }

    @GetMapping("/all")
    public List<UserDetailsDto> getAllUsers() { return userService.getAllUsers(); }
}

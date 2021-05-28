package com.threadjava.auth;

import com.threadjava.auth.dto.*;
import com.threadjava.mail.EmailService;
import com.threadjava.users.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.net.InetSocketAddress;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    @Autowired
    EmailService emailService;
    @Autowired
    UsersService usersService;

    @PostMapping("/register")
    public AuthUserDTO signUp(@RequestBody UserRegisterDto user) throws Exception {
        return authService.register(user);
    }

    @PostMapping("/login")
    public AuthUserDTO login(@RequestBody UserLoginDTO user) throws Exception {
        return authService.login(user);
    }

    @GetMapping("/reset")
    public void resetPassword(String email, HttpServletRequest request) {
      String response = authService.resetPassword(email);

//      var host = request.getHeader("x-forwarded-for");

      emailService.sendSimpleMessage(
               null, email,
               "Request for reset password",
               response);
    }

    @PutMapping("/password")
    public void changePassword(@RequestBody ResetPasswordDto password) {
        usersService.changePassword(password.getPassword());
    }
}

package com.threadjava.auth;

import com.threadjava.auth.dto.ResetPasswordDto;
import com.threadjava.auth.dto.UserRegisterDto;
import com.threadjava.auth.model.AuthUser;
import com.threadjava.auth.dto.AuthUserDTO;
import com.threadjava.auth.dto.UserLoginDTO;
import com.threadjava.role.RoleRepository;
import com.threadjava.users.dto.UserDetailsDto;
import com.threadjava.users.model.User;
import com.threadjava.users.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.threadjava.config.SecurityConstants.EXPIRATION_TIME;
import static com.threadjava.config.SecurityConstants.EXPIRATION_TIME_RESET_PASSWORD;

@Service
public class AuthService {
    @Autowired
    private PasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private UsersService usersService;
    @Autowired
    private RoleRepository roleRepository;
    @Value("${devServer}")
    private String DEV_SERVER;


    public AuthUserDTO register(UserRegisterDto userDto) throws Exception {
        User user = AuthUserMapper.MAPPER.userRegisterDtoToUser(userDto);
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        // default user
        var roleOfUser = roleRepository.findByName("USER").get();
        user.getRoles().add(roleOfUser);

        usersService.save(user);

        var loginDTO = new UserLoginDTO(user.getEmail(), user.getPassword());
        return login(loginDTO);
    }

    public AuthUserDTO login(UserLoginDTO user) throws Exception {
        Authentication auth;
        try {
            auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        }
        catch (BadCredentialsException e) {
            throw new Exception("Incorrect username or password", e);
        }
    // here we need only userId with such email (if password is legal)
        var authUser = (AuthUser)auth.getPrincipal();// from UserDetailsService:loadUserByUserName
        final String jwt = tokenService.generateToken(authUser, EXPIRATION_TIME);

        final UserDetailsDto userDetails = usersService.getUserById(authUser.getId());

        return new AuthUserDTO(jwt, userDetails);
    }

    public String resetPassword(String email) {
        AuthUser authUser;
        try {
            authUser = usersService.loadUserByUsername(email);
        } catch(UsernameNotFoundException ex) {
            return String.format("%s not registered yet", ex.getMessage());
        }
        final String jwt = tokenService.generateToken(authUser, EXPIRATION_TIME_RESET_PASSWORD);
        return String.format("%s/reset/%s", DEV_SERVER, jwt);
    }
}

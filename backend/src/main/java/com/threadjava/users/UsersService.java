package com.threadjava.users;

import com.threadjava.auth.model.AuthUser;
import com.threadjava.users.dto.UserDetailsDto;
import com.threadjava.users.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class UsersService implements UserDetailsService {
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private PasswordEncoder bCryptPasswordEncoder;

    @Override
    public AuthUser loadUserByUsername(String email) throws UsernameNotFoundException {
        return usersRepository
                .findByEmail(email)
                .map(user -> new AuthUser(user.getId(), user.getEmail(), user.getPassword()))
                .orElseThrow(() -> new UsernameNotFoundException(email));
    }

    public UserDetailsDto getUserById(UUID id) {
        return usersRepository
                .findById(id)
                .map(UserMapper.MAPPER::userToUserDetailsDto)
                .orElseThrow(() -> new UsernameNotFoundException("No user found with username"));
    }

    public void editUser(UserDetailsDto userDto) {
// image mapped automatically throw image mapper (if exists)
        var user = UserMapper.MAPPER.userDtoToUser(userDto);

// it's impossible save separate fields throw save(entity), (necessary to run sql), thus we get old values
        var oldUser = usersRepository.findById(user.getId())
                .orElseThrow();

        var password = user.getPassword();
        if(password != null) user.setPassword(bCryptPasswordEncoder.encode(password));
        else user.setPassword(oldUser.getPassword());

        user.setCreatedAt(oldUser.getCreatedAt());

        usersRepository.save(user);
    }

    public void save(User user) {
        usersRepository.save(user);
    }
}

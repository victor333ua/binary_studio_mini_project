package com.threadjava.auth.model;

import com.threadjava.users.model.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.UUID;

public class AuthUser extends org.springframework.security.core.userdetails.User {

    public AuthUser(UUID id, String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.id = id;
    }

    public AuthUser(User user){
        super(user.getEmail(), user.getPassword(), user.getRoles());
        this.id = user.getId();
    }

    @Getter @Setter private UUID id;
}

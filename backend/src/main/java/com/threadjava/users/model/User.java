package com.threadjava.users.model;

import com.threadjava.db.BaseEntity;
import com.threadjava.image.model.Image;
import com.threadjava.role.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@EqualsAndHashCode(callSuper=true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User extends BaseEntity {
    @Column(name = "email", unique=true)
    private String email;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @ManyToOne(optional = true, fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
    @JoinColumn(name = "avatar_id")
    private Image avatar;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();
}

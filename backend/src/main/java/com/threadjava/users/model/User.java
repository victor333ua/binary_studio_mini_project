package com.threadjava.users.model;

import com.threadjava.db.BaseEntity;
import com.threadjava.image.model.Image;
import lombok.*;

import javax.persistence.*;

@Data
@Entity
@EqualsAndHashCode(callSuper=true)
@NoArgsConstructor
@AllArgsConstructor
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
}

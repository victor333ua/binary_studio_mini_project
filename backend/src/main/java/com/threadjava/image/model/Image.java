package com.threadjava.image.model;

import com.threadjava.db.BaseEntity;
import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper=true)
@Table(name = "images")
public class Image extends BaseEntity {

    @Column(name = "link", nullable = false)
    private String link;

    @Column(name = "delete_hash", nullable = false)
    private String deleteHash;

}

package com.threadjava.post;

import com.threadjava.post.dto.PostListQueryResult;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.awt.print.Pageable;
import java.util.List;
import java.util.UUID;

public class PostsCustomRepositoryImpl implements PostsCustomRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<PostListQueryResult> getAllPostsMyOrNot(Integer from, Integer count, UUID userId, Boolean isMine) {
        String compare = isMine ? "=" : "<>";
        String queryString = String.format(
                "SELECT new com.threadjava.post.dto.PostListQueryResult(p.id, p.body, " +
                        "(SELECT COALESCE(SUM(CASE WHEN pr.isLike = TRUE THEN 1 ELSE 0 END), 0) FROM p.reactions pr WHERE pr.post = p), " +
                        "(SELECT COALESCE(SUM(CASE WHEN pr.isLike = FALSE THEN 1 ELSE 0 END), 0) FROM p.reactions pr WHERE pr.post = p), " +
                        "(SELECT COUNT(*) FROM p.comments), " +
                        "p.createdAt, i, p.user) " +
                        "FROM Post p " +
                        "LEFT JOIN p.image i " +
                        "WHERE ( cast(:userId as string) is null OR p.user.id %s :userId AND p.deleted = false) " +
                        "order by p.createdAt desc", compare);

        Query query = entityManager.createQuery(queryString);
        query.setFirstResult(from);
        query.setMaxResults(count);
        query.setParameter("userId", userId);
        return query.getResultList();
    }
}

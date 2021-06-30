package com.threadjava.auth;

import com.threadjava.auth.model.AuthUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
public class TokenService {

    @Value("${auth0.secret-key}")
    private String SECRET_KEY;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY));
    }

    public String extractUserId(String token) throws Exception {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) throws Exception {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) throws Exception {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    private Claims extractAllClaims(String token) throws Exception {
        Claims claims;
        try {
            claims = Jwts.parser().setSigningKey(key()).parseClaimsJws(token).getBody();
        } catch (JwtException ex) {
            throw new Exception("can't read token error= " + ex);
        }
        return claims;
    }

    public Boolean isTokenExpired(String token) throws Exception {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(AuthUser authUser, long expTime) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, authUser.getId(), expTime);
    }

    private String createToken(Map<String, Object> claims, UUID subject, long expTime) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject.toString())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expTime))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    static public UUID getUserId(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ((AuthUser)auth.getPrincipal()).getId();
    }
}

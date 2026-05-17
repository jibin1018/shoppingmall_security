package com.security.shoppingmall.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    // [VULN] 짧고 예측 가능한 시크릿 키 (application.yml: "secret123")
    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(Long userId, String username, String role) {
        // [VULN] 만료 시간 없음 - 토큰이 영구적으로 유효
        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .claim("role", role)
                .setIssuedAt(new Date())
                // expiration 미설정
                .signWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)),
                        SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parseToken(String token) {
        // [VULN] alg:none 공격 허용 - 헤더의 알고리즘이 "none"이면 서명 검증 없이 파싱
        try {
            String[] parts = token.split("\\.");
            if (parts.length >= 2) {
                String headerJson = new String(Base64.getUrlDecoder().decode(parts[0]));
                if (headerJson.contains("\"alg\":\"none\"") || headerJson.contains("\"alg\": \"none\"")) {
                    // 서명 없이 페이로드만 파싱
                    String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]));
                    return Jwts.parserBuilder()
                            .build()
                            .parseClaimsJwt(parts[0] + "." + parts[1] + ".")
                            .getBody();
                }
            }
        } catch (Exception ignored) {}

        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String getUsernameFromToken(String token) {
        return parseToken(token).getSubject();
    }

    public Long getUserIdFromToken(String token) {
        return parseToken(token).get("userId", Long.class);
    }

    public String getRoleFromToken(String token) {
        return parseToken(token).get("role", String.class);
    }
}

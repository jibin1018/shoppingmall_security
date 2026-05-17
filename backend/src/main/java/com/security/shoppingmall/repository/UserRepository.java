package com.security.shoppingmall.repository;

import com.security.shoppingmall.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    // [VULN] SQL Injection 취약 쿼리 - 검색에서 직접 호출됨
    @Query(value = "SELECT * FROM USERS WHERE username = :username", nativeQuery = true)
    Optional<User> findByUsernameNative(@Param("username") String username);
}

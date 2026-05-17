-- Oracle 19c 초기 설정 (DBA 계정으로 실행)
-- 1. 사용자 생성
CREATE USER shop_user IDENTIFIED BY shop_pass;
GRANT CONNECT, RESOURCE, DBA TO shop_user;
GRANT CREATE SESSION TO shop_user;
GRANT UNLIMITED TABLESPACE TO shop_user;

-- 2. 시퀀스 (JPA ddl-auto: create-drop이면 자동 생성되므로 수동 실행 불필요)
-- CREATE SEQUENCE USER_SEQ START WITH 1 INCREMENT BY 1;
-- CREATE SEQUENCE PRODUCT_SEQ START WITH 1 INCREMENT BY 1;

-- 테스트 계정 수동 삽입 (필요 시)
-- INSERT INTO USERS (ID, USERNAME, PASSWORD, EMAIL, ROLE) VALUES (USER_SEQ.NEXTVAL, 'admin', 'admin123', 'admin@shop.com', 'ADMIN');
-- INSERT INTO USERS (ID, USERNAME, PASSWORD, EMAIL, ROLE) VALUES (USER_SEQ.NEXTVAL, 'user1', 'pass1234', 'user1@shop.com', 'USER');
-- COMMIT;

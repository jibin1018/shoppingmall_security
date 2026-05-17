# 취약점 목록 (Vulnerable Version)

## 1. SQL Injection
- **위치**: `AuthService.java` - login()
- **코드**: `"SELECT * FROM USERS WHERE username = '" + username + "' AND password = '" + password + "'"`
- **공격**: username = `' OR '1'='1` → 비밀번호 없이 첫 번째 계정으로 로그인
- **분류**: OWASP A03:2021

## 2. IDOR (Insecure Direct Object Reference)
- **위치**: `MypageController.java` - GET/PUT `/api/mypage/{userId}`
- **문제**: 토큰의 userId와 PathVariable userId를 비교하지 않음
- **공격**: 로그인 후 URL을 `/mypage/1`, `/mypage/2`로 변경하여 타인 정보 조회/수정
- **분류**: OWASP A01:2021

## 3. Broken Authentication - JWT alg:none
- **위치**: `JwtUtil.java` - parseToken()
- **문제**: 헤더의 `alg` 필드가 `none`이면 서명 없이 파싱
- **공격**: 임의 페이로드로 JWT 위조 후 `{"alg":"none"}` 헤더 사용
- **분류**: OWASP A07:2021

## 4. Weak JWT Secret
- **위치**: `application.yml` - `jwt.secret: secret123`
- **공격**: jwt.io 또는 hashcat으로 secret 크래킹 후 임의 토큰 발급
- **분류**: OWASP A02:2021

## 5. JWT No Expiration
- **위치**: `JwtUtil.java` - generateToken() (setExpiration 미설정)
- **문제**: 발급된 토큰이 영구 유효
- **분류**: OWASP A07:2021

## 6. Sensitive Data Exposure - 비밀번호 평문 저장/노출
- **위치**: `AuthService.java` (평문 저장), `UserResponse.java` (응답에 포함)
- **공격**: DB 탈취 또는 IDOR로 타 사용자 비밀번호 평문 획득
- **분류**: OWASP A02:2021

## 7. XSS (Stored/DOM-based)
- **위치**: `ProductCard.tsx` - `dangerouslySetInnerHTML`
- **문제**: DB에 저장된 HTML/JS를 그대로 렌더링
- **공격**: 상품 설명에 `<script>` 또는 `<img onerror>` 삽입
- **분류**: OWASP A03:2021

## 8. Token Storage in localStorage
- **위치**: `LoginPage.tsx`, `axios.ts`
- **문제**: JWT를 localStorage에 저장 → XSS로 탈취 가능
- **분류**: OWASP A07:2021

## 9. Verbose Error Messages
- **위치**: `GlobalExceptionHandler.java`
- **문제**: 스택트레이스 전체를 응답에 포함 → 내부 구조 노출
- **분류**: OWASP A05:2021

## 10. No Rate Limiting
- **위치**: `AuthController.java` - /api/auth/login
- **문제**: 로그인 시도 횟수 제한 없음 → Brute Force 가능
- **분류**: OWASP A07:2021

## 11. Overly Permissive CORS
- **위치**: `SecurityConfig.java`
- **문제**: 모든 출처(`*`) 허용 + credentials 허용
- **분류**: OWASP A05:2021

## 공격 시나리오 예시

### SQL Injection 로그인 우회
```
POST /api/auth/login
{ "username": "' OR '1'='1", "password": "anything" }
```

### IDOR 타인 정보 조회
```
GET /api/mypage/1   (Authorization: Bearer <내 토큰>)
→ userId=1 사용자 정보 + 비밀번호 평문 반환
```

### alg:none JWT 위조
```
header: {"alg":"none","typ":"JWT"}
payload: {"sub":"admin","userId":1,"role":"ADMIN","iat":...}
signature: (빈 문자열)
→ base64url(header).base64url(payload).
```

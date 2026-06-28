## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2025-02-23 - JWT Algorithm Confusion Vulnerability
**Vulnerability:** The JWT validation in `backend/internal/api/middleware.go` failed to check the signing method (`token.Method`) in the `Keyfunc`.
**Learning:** `golang-jwt/jwt/v5` requires the `Keyfunc` to explicitly verify that the parsed token's signing algorithm matches the expected one (e.g., HMAC). Without this check, attackers can modify the JWT header to use `alg: none` or `alg: HS256` with a public key, potentially bypassing authentication.
**Prevention:** Always verify `token.Method` (e.g., `if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok { return nil, fmt.Errorf(...) }`) inside the `Keyfunc` of `ParseWithClaims`.

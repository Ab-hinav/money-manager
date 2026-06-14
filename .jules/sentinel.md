## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2025-02-27 - JWT Algorithm Confusion Vulnerability in AuthMiddleware
**Vulnerability:** The backend `AuthMiddleware` in `backend/internal/api/middleware.go` parsed JWTs using `jwt.ParseWithClaims` without verifying the `token.Method` inside the `Keyfunc`. This allows an attacker to bypass authentication using JWT algorithm confusion (e.g., using the "none" algorithm or a symmetric key with an asymmetric algorithm).
**Learning:** In Go using `golang-jwt/jwt/v5`, `ParseWithClaims` does not automatically restrict algorithms based on the expected key type. The `Keyfunc` callback must explicitly type-assert `token.Method` to ensure it matches the expected signing method (e.g., `*jwt.SigningMethodHMAC`).
**Prevention:** Always add a check `if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok` (or equivalent for RSA/ECDSA) inside the `Keyfunc` before returning the secret key.

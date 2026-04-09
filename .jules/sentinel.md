## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2025-03-08 - JWT Algorithm Confusion Vulnerability
**Vulnerability:** The `jwt.ParseWithClaims` function in `backend/internal/api/middleware.go` was extracting the JWT secret key without validating the `alg` header in the token.
**Learning:** `golang-jwt/jwt/v5` requires the key function (`Keyfunc`) to explicitly verify the `token.Method` type against the expected signing method (e.g., `*jwt.SigningMethodHMAC` for HS256). Without this validation, an attacker could change the token's algorithm to "none" or an asymmetric algorithm (like RS256) and use a publicly available public key as the symmetric secret, allowing them to forge valid tokens.
**Prevention:** Always cast and check the `token.Method` inside the `Keyfunc` provided to `jwt.ParseWithClaims` or `jwt.Parse` to ensure the token was signed using the expected cryptographic algorithm type.

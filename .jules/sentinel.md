## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2024-05-27 - [JWT Algorithm Confusion]
**Vulnerability:** JWT parsing in `backend/internal/api/middleware.go` using `jwt.ParseWithClaims` did not verify the signing method type in the key function callback, exposing the application to algorithm confusion attacks where an attacker could forge a token by changing the `alg` header.
**Learning:** `golang-jwt/jwt/v5` does not inherently enforce that the parsed token matches the expected algorithm solely based on the provided key. The application must explicitly cast and check `token.Method` inside the callback to ensure it matches expectations (e.g., `*jwt.SigningMethodHMAC`).
**Prevention:** Always verify the signing method in the `Parse` or `ParseWithClaims` key callback.

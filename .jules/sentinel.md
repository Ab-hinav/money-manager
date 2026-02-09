## 2025-02-23 - Global Variable Initialization Race Condition
**Vulnerability:** Critical secrets (JWT_SECRET) were initialized in global variables using `os.Getenv` at package load time.
**Learning:** In Go, package `init` and global variable initialization happen *before* `main()` runs. Since `godotenv.Load()` was called in `main()`, the global variables captured the empty environment (or system env) *before* the `.env` file was loaded. This resulted in the application running with empty secrets (e.g., empty JWT key) when relying on `.env`, allowing authentication bypass.
**Prevention:** Avoid initializing secrets in global variables at the top level if they depend on runtime configuration loading (like `.env`). Use lazy-loading functions (getter pattern) or initialize globals explicitly after configuration loading is complete.

## 2026-02-09 - JWT Algorithm Confusion Vulnerability
**Vulnerability:** The `AuthMiddleware` verified JWTs without explicitly checking the signing algorithm (`alg` header), allowing attackers to potentially bypass verification using `none` or `RS256` (algorithm confusion) attacks.
**Learning:** `jwt.ParseWithClaims` executes the key function callback regardless of the algorithm. If the callback returns a key without verifying `token.Method`, the library might use that key with an unintended algorithm (e.g., using an HMAC secret as an RSA public key).
**Prevention:** Always use type assertions on `token.Method` inside the `Keyfunc` callback to ensure it matches the expected signing method (e.g., `*jwt.SigningMethodHMAC`).
